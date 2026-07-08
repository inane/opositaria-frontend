import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';

@Component({
  imports: [PageHeaderComponent],
  template: `
    <opo-page-header [title]="title" [description]="description">
      <button type="button">Action</button>
    </opo-page-header>
  `,
})
class TestHostComponent {
  title = 'Page title';
  description = '';
}

describe('The PageHeaderComponent', () => {
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

  it('renders its title as the primary heading', () => {
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1');

    expect(heading?.textContent).toBe('Page title');
  });

  it('renders optional description when provided', () => {
    fixture.componentInstance.description = 'Page description';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Page description');
  });

  it('renders projected actions', () => {
    fixture.detectChanges();

    const action = fixture.nativeElement.querySelector('button');

    expect(action?.textContent).toContain('Action');
  });
});
