import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: `
    <opo-button [variant]="variant" [size]="size" [disabled]="isDisabled" (pressed)="onPressed()"
      >Start ingestion</opo-button
    >
  `,
})
class TestHostComponent {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
  size: 'sm' | 'md' | 'lg' = 'md';
  isDisabled = false;
  onPressed = vi.fn();
}

describe('The ButtonComponent', () => {
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

  it('renders projected visible text as a native button', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Start ingestion');
  });

  it('defaults to type button', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.getAttribute('type')).toBe('button');
  });

  it('exposes disabled native semantics', () => {
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
  });

  it('emits pressed output when enabled', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(fixture.componentInstance.onPressed).toHaveBeenCalled();
  });

  it('does not emit pressed output when disabled', () => {
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(fixture.componentInstance.onPressed).not.toHaveBeenCalled();
  });

  it('reflects variant and size through data attributes', () => {
    fixture.componentInstance.variant = 'secondary';
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('opo-button');

    expect(host.getAttribute('data-variant')).toBe('secondary');
    expect(host.getAttribute('data-size')).toBe('lg');
  });
});
