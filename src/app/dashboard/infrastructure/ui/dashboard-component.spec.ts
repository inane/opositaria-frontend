import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DashboardComponent } from './dashboard-component';

describe('The Dashboard Shell', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'dashboard', children: [] },
          { path: 'dashboard/profile', children: [] },
          { path: '**', children: [] },
        ]),
      ],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('renders a header, a main content area, and a footer', () => {
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('header')).toBeTruthy();
    expect(root.querySelector('main')).toBeTruthy();
    expect(root.querySelector('footer')).toBeTruthy();
  });

  it('labels the header landmark accessibly', () => {
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('header') as HTMLElement;

    expect(header.getAttribute('aria-label')).toBe('Application header');
  });

  it('renders a routed feature outlet in the main content area', () => {
    fixture.detectChanges();

    const main = fixture.nativeElement.querySelector('main') as HTMLElement;

    expect(main.querySelector('router-outlet')).toBeTruthy();
  });

  it('uses a full-height vertical layout with a growing main area', () => {
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const main = root.querySelector('main') as HTMLElement;

    expect(root.classList.contains('dashboard-shell')).toBe(true);
    expect(main.classList.contains('dashboard-content--grow')).toBe(true);
  });

  it('offers one menu button in the header', () => {
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector('header') as HTMLElement;
    const buttons = header.querySelectorAll('button');

    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(buttons[0].classList.contains('burger-menu-button')).toBe(true);
  });

  it('displays Opositaria product branding in the header', () => {
    fixture.detectChanges();

    const brand = fixture.nativeElement.querySelector('.dashboard-brand') as HTMLElement;

    expect(brand).toBeTruthy();
    expect(brand.textContent).toContain('Opositaria');
  });

  it('renders utility buttons in the header', () => {
    fixture.detectChanges();

    const utilityButtons = fixture.nativeElement.querySelectorAll('.dashboard-utility-button');

    expect(utilityButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('gives utility buttons accessible names', () => {
    fixture.detectChanges();

    const utilityButtons = fixture.nativeElement.querySelectorAll('.dashboard-utility-button');

    for (const button of utilityButtons) {
      expect(button.getAttribute('aria-label')).toBeTruthy();
    }
  });

  it('labels the menu button for screen readers', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('aria-label')).toBe('Open menu');
  });

  it('provides a large enough touch target for the burger button', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLElement;
    const styles = window.getComputedStyle(button);

    expect(parseFloat(styles.minWidth)).toBeGreaterThanOrEqual(2.75);
    expect(parseFloat(styles.minHeight)).toBeGreaterThanOrEqual(2.75);
  });

  it('announces whether the side menu is expanded', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('gives utility buttons minimum 44px touch target', () => {
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.dashboard-utility-button');

    for (const btn of buttons) {
      const styles = window.getComputedStyle(btn);
      expect(parseFloat(styles.minWidth)).toBeGreaterThanOrEqual(2.75);
      expect(parseFloat(styles.minHeight)).toBeGreaterThanOrEqual(2.75);
    }
  });

  it('renders a dedicated dashboard side navigation component while preserving the shell layout', () => {
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    const sideNav = root.querySelector('app-dashboard-side-navigation');

    expect(sideNav).toBeTruthy();
    expect(root.querySelector('header')).toBeTruthy();
    expect(root.querySelector('main')).toBeTruthy();
    expect(root.querySelector('footer')).toBeTruthy();
  });

  it('points the menu button to the single side navigation target', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;
    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.id).toBe('side-menu');
    expect(button.getAttribute('aria-controls')).toBe('side-menu');
  });

  it('identifies the side navigation as a navigation region', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBe('Side menu');
  });

  it('opens the side menu as an overlay above the dashboard content', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);
  });

  it('keeps the side menu overlay closed on initial render', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
  });

  it('displays educational entries in the opened side navigation', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.textContent).toContain('Dashboard');
  });

  it('opens the side navigation when the burger button is activated', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);

    button.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);
  });

  it('closes the side navigation when the burger button is activated again', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);

    button.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
  });

  it('keeps the side navigation open when clicking inside the navigation', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    nav.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);
  });

  it('keeps expanded desktop navigation open when clicking the main content', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const main = fixture.nativeElement.querySelector('main') as HTMLElement;

    main.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);
  });

  it('closes the side navigation when clicking the backdrop', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);

    const backdrop = fixture.nativeElement.querySelector('.side-menu-backdrop') as HTMLElement;

    backdrop.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
  });

  it('closes the side navigation when Escape is pressed', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
  });

  it('renders navigation items from a collection model with multiple educational entries', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const items = nav.querySelectorAll('.side-navigation-link, .side-navigation-group-toggle');

    expect(items.length).toBeGreaterThanOrEqual(8);
    expect(items[0].textContent).toContain('Dashboard');
  });

  it('exposes an icon within the navigation link selectable target', () => {
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.side-navigation-link') as HTMLElement;
    const icon = item.querySelector('.side-navigation-icon');

    expect(icon).toBeTruthy();
    expect(icon?.textContent?.trim()).toBeTruthy();
  });

  it('makes the navigation link accessible by its label name in icon-only state', () => {
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.side-navigation-link') as HTMLElement;

    expect(item.getAttribute('aria-label')).toBe('Dashboard');
  });

  it('navigates to /dashboard through the Dashboard navigation link', () => {
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.side-navigation-link') as HTMLElement;

    expect(item.tagName).toBe('A');
    expect(item.getAttribute('href')).toBe('/dashboard');
  });

  it('announces the current page for the active Dashboard navigation item', async () => {
    await router.navigateByUrl('/dashboard');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.side-navigation-link') as HTMLElement;

    expect(item.classList.contains('active-link')).toBe(true);
  });

  it('renders the side navigation in a collapsed state on initial render', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
  });

  it('renders a compact rail container for the collapsed side navigation', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.classList.contains('side-navigation--rail')).toBe(true);
  });

  it('keeps the navigation link selectable through its icon area when collapsed', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const link = nav.querySelector('.side-navigation-link') as HTMLAnchorElement;

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/dashboard');
    expect(link.querySelector('.side-navigation-icon')).toBeTruthy();
  });

  it('expands the side navigation when the burger button is activated', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);

    button.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);
  });

  it('shows icon and text label together in the expanded navigation link', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const link = nav.querySelector('.side-navigation-link') as HTMLAnchorElement;

    expect(link.querySelector('.side-navigation-icon')).toBeTruthy();
    expect(link.textContent).toContain('Dashboard');
  });

  it('exposes expanded state on the burger button when navigation is opened', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('collapses the side navigation when the burger button is activated while expanded', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);

    button.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
  });

  it('provides a side-by-side layout container for navigation and main content', () => {
    fixture.detectChanges();

    const body = fixture.nativeElement.querySelector('.dashboard-body') as HTMLElement;

    expect(body).toBeTruthy();
    expect(body.contains(fixture.nativeElement.querySelector('.side-navigation'))).toBe(true);
    expect(body.contains(fixture.nativeElement.querySelector('main'))).toBe(true);
  });

  it('distinguishes the compact rail from the expanded panel through CSS classes', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.classList.contains('side-navigation--rail')).toBe(true);

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--rail')).toBe(false);
  });

  it('positions the main content beside the navigation without overlay positioning on desktop', () => {
    fixture.detectChanges();

    const main = fixture.nativeElement.querySelector('main') as HTMLElement;

    expect(window.getComputedStyle(main).position).not.toBe('fixed');
    expect(fixture.nativeElement.querySelector('.dashboard-body')).toBeTruthy();
  });

  it('keeps the mobile overlay drawer backdrop conditional on the open state', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.side-menu-backdrop')).toBeFalsy();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.side-menu-backdrop')).toBeTruthy();
  });

  it('keeps the side navigation collapsed state on initial render', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);
  });

  it('does not apply overlay fixed positioning to the main content when mobile drawer is open', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    const main = fixture.nativeElement.querySelector('main') as HTMLElement;

    expect(window.getComputedStyle(main).position).not.toBe('fixed');
  });

  it('collapses expanded desktop navigation when Escape is pressed', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
  });

  it('collapses the expanded desktop navigation when the Dashboard link is selected', async () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);

    const link = nav.querySelector('.side-navigation-link') as HTMLAnchorElement;
    link.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
  });

  it('closes the side navigation when the Dashboard link is selected', async () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(false);

    const link = fixture.nativeElement.querySelector('.side-navigation-link') as HTMLAnchorElement;
    link.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(nav.classList.contains('side-navigation--collapsed')).toBe(true);
    expect(fixture.nativeElement.querySelector('.side-menu-backdrop')).toBeFalsy();
  });

  it('uses a navigation landmark for the side navigation region', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.getAttribute('role')).toBe('navigation');
    expect(nav.getAttribute('aria-label')).toBeTruthy();
  });

  it('updates the hamburger button accessible label in the open state', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    expect(button.getAttribute('aria-label')).toBe('Open menu');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-label')).toBe('Close menu');
  });

  it('provides a sufficient touch target for the collapsed navigation link', () => {
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.side-navigation-link') as HTMLElement;
    const styles = window.getComputedStyle(link);

    expect(parseFloat(styles.minWidth)).toBeGreaterThanOrEqual(2.75);
    expect(parseFloat(styles.minHeight)).toBeGreaterThanOrEqual(2.75);
  });

  it('marks the active navigation link with a styling hook', async () => {
    await router.navigateByUrl('/dashboard');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const item = fixture.nativeElement.querySelector('.side-navigation-link') as HTMLElement;

    expect(item.classList.contains('active-link')).toBe(true);
  });

  it('renders exactly one side navigation landmark for the dashboard menu', () => {
    fixture.detectChanges();

    const navLandmarks = fixture.nativeElement.querySelectorAll('[role="navigation"]');

    expect(navLandmarks.length).toBe(1);

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    const navLandmarksAfter = fixture.nativeElement.querySelectorAll('[role="navigation"]');

    expect(navLandmarksAfter.length).toBe(1);
  });

  it('wraps the Dashboard label in a dedicated visual label element while keeping the accessible name', () => {
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.side-navigation-link') as HTMLAnchorElement;

    const labelEl = link.querySelector('.side-navigation-label');

    expect(labelEl).toBeTruthy();
    expect(labelEl?.textContent).toBe('Dashboard');
    expect(link.getAttribute('aria-label')).toBe('Dashboard');
  });

  it('hides the Dashboard label visually in the collapsed rail while keeping the icon selectable', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;

    expect(nav.classList.contains('side-navigation--rail')).toBe(true);

    const label = nav.querySelector('.side-navigation-label') as HTMLElement;
    const labelStyle = window.getComputedStyle(label);

    expect(labelStyle.opacity).toBe('0');

    const icon = nav.querySelector('.side-navigation-icon') as HTMLElement;
    const iconStyle = window.getComputedStyle(icon);

    expect(iconStyle.display).not.toBe('none');
  });

  it('gives the home icon an explicit larger visual size in the collapsed rail', () => {
    fixture.detectChanges();

    const icon = fixture.nativeElement.querySelector('.side-navigation-icon') as HTMLElement;
    const styles = window.getComputedStyle(icon);

    expect(styles.fontSize).toBe('1.5rem');
  });

  it('transitions the sidebar width and label opacity when collapsing or expanding', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('.side-navigation') as HTMLElement;
    const navStyle = window.getComputedStyle(nav);

    expect(navStyle.transition).toContain('width');

    const label = nav.querySelector('.side-navigation-label') as HTMLElement;
    const labelStyle = window.getComputedStyle(label);

    expect(labelStyle.transition).toContain('opacity');
    expect(labelStyle.transition).toContain('max-width');
  });
});
