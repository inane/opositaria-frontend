import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageSectionComponent } from './page-section.component';

@Component({
  imports: [PageSectionComponent],
  template: `
    <opo-page-section [title]="title" [description]="description"> Section body </opo-page-section>
  `,
})
class TestHostComponent {
  title = '';
  description = '';
}

describe('The PageSectionComponent', () => {
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

  it('renders projected body content', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Section body');
  });

  it('renders optional title as a section heading', () => {
    fixture.componentInstance.title = 'Section title';
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h2');

    expect(heading?.textContent).toBe('Section title');
  });

  it('renders optional description when provided', () => {
    fixture.componentInstance.description = 'Section description';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Section description');
  });
});
