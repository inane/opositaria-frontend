import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

@Component({
  imports: [CardComponent],
  template: `<opo-card [variant]="variant">Card content</opo-card>`,
})
class TestHostComponent {
  variant: 'default' | 'muted' | 'outlined' = 'default';
}

describe('The CardComponent', () => {
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

  it('renders projected content', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Card content');
  });

  it('reflects variant through a data attribute', () => {
    fixture.componentInstance.variant = 'outlined';
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('opo-card');

    expect(host.getAttribute('data-variant')).toBe('outlined');
  });
});
