import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardSideNavigationComponent } from './dashboard-side-navigation.component';

describe('The Dashboard Side Navigation', () => {
  let fixture: ComponentFixture<DashboardSideNavigationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: '**', children: [] }])],
    });
    fixture = TestBed.createComponent(DashboardSideNavigationComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('applies collapsed and rail classes when the isOpen input is false', () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
    expect(nav.classList.contains('side-navigation--rail')).toBe(true);
  });

  it('removes collapsed and rail classes when the isOpen input is true', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);
    expect(nav.classList.contains('side-navigation--rail')).toBe(false);
  });
});
