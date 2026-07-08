import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

@Component({
  imports: [BadgeComponent],
  template: `<opo-badge [tone]="tone">Pending</opo-badge>`,
})
class TestHostComponent {
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'error' = 'neutral';
}

describe('The BadgeComponent', () => {
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

  it('renders projected text', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Pending');
  });

  it('reflects tone through a data attribute', () => {
    fixture.componentInstance.tone = 'success';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('opo-badge');

    expect(host.getAttribute('data-tone')).toBe('success');
  });
});
