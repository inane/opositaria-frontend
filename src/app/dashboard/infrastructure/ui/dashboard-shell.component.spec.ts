import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell.component';

describe('The Dashboard Shell', () => {
  let fixture: ComponentFixture<DashboardShellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(DashboardShellComponent);
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

    expect(buttons.length).toBe(1);
    expect(buttons[0].classList.contains('burger-menu-button')).toBe(true);
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

  it('identifies the side menu overlay as a navigation region', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.side-menu-panel') as HTMLElement;

    expect(panel.getAttribute('role')).toBe('navigation');
    expect(panel.getAttribute('aria-label')).toBe('Side menu');
  });

  it('opens the side menu as an overlay above the dashboard content', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.side-menu-panel') as HTMLElement;

    expect(window.getComputedStyle(panel).position).toBe('fixed');
  });

  it('keeps the side menu overlay closed on initial render', () => {
    fixture.detectChanges();

    const sideMenu = fixture.nativeElement.querySelector('.side-menu-panel');

    expect(sideMenu).toBeFalsy();
  });

  it('displays an Inicio entry in the opened side menu', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const sideMenu = fixture.nativeElement.querySelector('.side-menu-panel') as HTMLElement;

    expect(sideMenu.textContent).toContain('Inicio');
  });

  it('opens the side menu overlay when the burger button is activated', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const sideMenu = fixture.nativeElement.querySelector('.side-menu-panel');

    expect(sideMenu).toBeTruthy();
  });

  it('closes the side menu overlay when the burger button is activated again', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    const sideMenu = fixture.nativeElement.querySelector('.side-menu-panel');

    expect(sideMenu).toBeFalsy();
  });

  it('closes the side menu overlay when clicking outside the panel', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.side-menu-backdrop') as HTMLElement;

    backdrop.click();
    fixture.detectChanges();

    const sideMenu = fixture.nativeElement.querySelector('.side-menu-panel');

    expect(sideMenu).toBeFalsy();
  });

  it('keeps the side menu overlay open when clicking inside the panel', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.side-menu-panel') as HTMLElement;

    panel.click();
    fixture.detectChanges();

    const sideMenu = fixture.nativeElement.querySelector('.side-menu-panel');

    expect(sideMenu).toBeTruthy();
  });

  it('closes the side menu overlay when Escape is pressed', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.burger-menu-button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    const sideMenu = fixture.nativeElement.querySelector('.side-menu-panel');

    expect(sideMenu).toBeFalsy();
  });
});
