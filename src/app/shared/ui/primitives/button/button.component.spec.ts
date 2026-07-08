import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: `<opo-button [disabled]="isDisabled">Start ingestion</opo-button>`,
})
class TestHostComponent {
  isDisabled = false;
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
});
