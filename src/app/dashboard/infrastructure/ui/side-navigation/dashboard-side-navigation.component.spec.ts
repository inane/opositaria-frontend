import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('renders one side navigation landmark for the dashboard menu', () => {
    fixture.detectChanges();

    const navLandmarks = fixture.nativeElement.querySelectorAll('[role="navigation"]');
    const nav = navLandmarks[0] as HTMLElement;

    expect(navLandmarks.length).toBe(1);
    expect(nav.id).toBe('side-menu');
    expect(nav.getAttribute('aria-label')).toBe('Side menu');
  });

  it('renders Inicio as the current dashboard navigation link with icon and visual label', () => {
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.side-navigation-item') as HTMLAnchorElement;
    const icon = link.querySelector('.side-navigation-icon');
    const label = link.querySelector('.side-navigation-label');

    expect(link.getAttribute('href')).toBe('/dashboard');
    expect(link.getAttribute('aria-label')).toBe('Inicio');
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(icon).toBeTruthy();
    expect(label?.textContent).toBe('Inicio');
  });

  it('announces when the Inicio navigation item is selected', () => {
    const onItemSelected = vi.fn();
    fixture.componentInstance.itemSelected.subscribe(onItemSelected);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.side-navigation-item') as HTMLAnchorElement;

    link.click();

    expect(onItemSelected).toHaveBeenCalledOnce();
  });
});
