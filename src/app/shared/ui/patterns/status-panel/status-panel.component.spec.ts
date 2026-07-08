import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusPanelComponent } from './status-panel.component';

@Component({
  imports: [StatusPanelComponent],
  template: `
    <opo-status-panel [tone]="tone" [title]="title" [message]="message" [live]="live">
      <button type="button" data-testid="recovery">Retry</button>
    </opo-status-panel>
  `,
})
class TestHostComponent {
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'error' = 'info';
  title = 'Status';
  message = 'Processing your request';
  live: 'off' | 'polite' | 'assertive' = 'polite';
}

describe('The StatusPanelComponent', () => {
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

  it('renders title and message', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Status');
    expect(fixture.nativeElement.textContent).toContain('Processing your request');
  });

  it('uses a polite live region by default', () => {
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('[role="status"]');

    expect(panel).toBeTruthy();
    expect(panel.getAttribute('aria-live')).toBe('polite');
  });

  it('can use an assertive alert role', () => {
    fixture.componentInstance.live = 'assertive';
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('[role="alert"]');

    expect(panel).toBeTruthy();
  });

  it('renders projected recovery actions', () => {
    fixture.detectChanges();

    const recovery = fixture.nativeElement.querySelector('[data-testid="recovery"]');

    expect(recovery).toBeTruthy();
  });
});
