import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadDropzoneComponent } from './upload-dropzone.component';

@Component({
  imports: [UploadDropzoneComponent],
  template: `
    <opo-upload-dropzone
      label="Upload source"
      [description]="description"
      [accept]="accept"
      [disabled]="disabled"
      (fileSelected)="onFileSelected($event)"
    />
  `,
})
class TestHostComponent {
  description = '';
  accept = '.pdf';
  disabled = false;
  onFileSelected = vi.fn();
}

describe('The UploadDropzoneComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    fixture = TestBed.createComponent(TestHostComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders a visible label and a file input accessible by label', () => {
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label');
    const input = fixture.nativeElement.querySelector('input[type="file"]');

    expect(label?.textContent).toContain('Upload source');
    expect(input).toBeTruthy();
    expect(input.id).toBe(label.getAttribute('for'));
  });

  it('renders optional description text', () => {
    fixture.componentInstance.description = 'Only PDF files';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Only PDF files');
  });

  it('forwards accepted file types to the native file input', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="file"]');

    expect(input.getAttribute('accept')).toBe('.pdf');
  });

  it('emits the selected file through fileSelected output', () => {
    fixture.detectChanges();

    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.onFileSelected).toHaveBeenCalledWith(file);
  });

  it('can be disabled', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="file"]');

    expect(input.disabled).toBe(true);
  });
});
