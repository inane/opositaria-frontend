import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

@Component({
  imports: [AlertComponent],
  template: ` <opo-alert [tone]="tone" [title]="title"> Something went wrong </opo-alert> `,
})
class TestHostComponent {
  tone: 'info' | 'success' | 'warning' | 'error' = 'error';
  title = '';
}

describe('The AlertComponent', () => {
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

  it('renders visible projected message text', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Something went wrong');
  });

  it('exposes role alert for error tone', () => {
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');

    expect(alert).toBeTruthy();
  });

  it('avoids interruptive alert role for info tone', () => {
    fixture.componentInstance.tone = 'info';
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');

    expect(alert).toBeFalsy();
  });

  it('renders optional title when provided', () => {
    fixture.componentInstance.title = 'Validation failed';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Validation failed');
  });
});
