import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { SideNavigationComponent } from './side-navigation.component';
import { educationalMenu } from '../../../domain/navigation-menu';

describe('The Dashboard Side Navigation', () => {
  let fixture: ComponentFixture<SideNavigationComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'dashboard', children: [] },
          { path: 'dashboard/profile', children: [] },
          { path: 'dashboard/syllabus', children: [] },
          { path: 'dashboard/syllabus/topics', children: [] },
          { path: 'dashboard/syllabus/progress', children: [] },
          { path: 'dashboard/syllabus/progress-extra', children: [] },
          { path: 'dashboard/syllabus/favorites', children: [] },
          { path: 'dashboard/review/flashcards', children: [] },
          { path: '**', children: [] },
        ]),
      ],
    });
    fixture = TestBed.createComponent(SideNavigationComponent);
    router = TestBed.inject(Router);
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

    const navLandmarks = fixture.nativeElement.querySelectorAll('mat-nav-list');
    const nav = navLandmarks[0] as HTMLElement;

    expect(navLandmarks.length).toBe(1);
    expect(nav.id).toBe('side-menu');
    expect(nav.getAttribute('aria-label')).toBe('Side menu');
  });

  it('renders Dashboard as a navigation link', () => {
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('[href="/dashboard"]') as HTMLAnchorElement;

    expect(link).toBeTruthy();
    expect(link.textContent).toContain('Dashboard');
    expect(link.getAttribute('aria-label')).toBe('Dashboard');
    expect(link.hasAttribute('mat-list-item')).toBe(true);
  });

  it('renders Syllabus as a group control', () => {
    fixture.detectChanges();

    const syllabusButton = fixture.nativeElement.querySelector(
      '.side-navigation-group-toggle',
    ) as HTMLButtonElement;

    expect(syllabusButton).toBeTruthy();
    expect(syllabusButton.textContent).toContain('Syllabus');
  });

  it('renders Tests as a group control', () => {
    fixture.detectChanges();

    const testsButton = fixture.nativeElement.querySelectorAll(
      '.side-navigation-group-toggle',
    )[1] as HTMLButtonElement;

    expect(testsButton).toBeTruthy();
    expect(testsButton.textContent).toContain('Tests');
  });

  it('renders Profile as a navigation link', () => {
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      '[href="/dashboard/profile"]',
    ) as HTMLAnchorElement;

    expect(link).toBeTruthy();
    expect(link.textContent).toContain('Profile');
  });

  it('renders Settings as a navigation link', () => {
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      '[href="/dashboard/settings"]',
    ) as HTMLAnchorElement;

    expect(link).toBeTruthy();
    expect(link.textContent).toContain('Settings');
  });

  it('renders the same number of primary entries as the educational menu', () => {
    fixture.detectChanges();

    const linkEntries = fixture.nativeElement.querySelectorAll(
      '.side-navigation-link, .side-navigation-group-toggle',
    );
    const primaryEntries = educationalMenu.filter((entry) => entry.type === 'link');
    const groupEntries = educationalMenu.filter((entry) => entry.type === 'group');

    expect(linkEntries.length).toBe(primaryEntries.length + groupEntries.length);
  });

  it('announces when a navigation item is selected', () => {
    const onItemSelected = vi.fn();
    fixture.componentInstance.itemSelected.subscribe(onItemSelected);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('[href="/dashboard"]') as HTMLAnchorElement;

    link.click();

    expect(onItemSelected).toHaveBeenCalledOnce();
  });

  it('hides group children by default', () => {
    fixture.detectChanges();

    const groupChildren = fixture.nativeElement.querySelector('.side-navigation-group-children');

    expect(groupChildren).toBeFalsy();
  });

  it('shows Syllabus children when the Syllabus group is activated', () => {
    fixture.detectChanges();

    const syllabusButton = fixture.nativeElement.querySelector(
      '.side-navigation-group-toggle',
    ) as HTMLButtonElement;
    syllabusButton.click();
    fixture.detectChanges();

    const children = fixture.nativeElement.querySelector(
      '.side-navigation-group-children',
    ) as HTMLElement;

    expect(children).toBeTruthy();
    expect(children.textContent).toContain('My topics');
    expect(children.textContent).toContain('Progress');
    expect(children.textContent).toContain('Favorites');
  });

  it('hides group children when an expanded group is activated again', () => {
    fixture.detectChanges();

    const syllabusButton = fixture.nativeElement.querySelector(
      '.side-navigation-group-toggle',
    ) as HTMLButtonElement;
    syllabusButton.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.side-navigation-group-children')).toBeTruthy();

    syllabusButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.side-navigation-group-children')).toBeFalsy();
  });

  it('exposes expanded state on group toggle buttons', () => {
    fixture.detectChanges();

    const syllabusButton = fixture.nativeElement.querySelector(
      '.side-navigation-group-toggle',
    ) as HTMLButtonElement;

    expect(syllabusButton.getAttribute('aria-expanded')).toBe('false');

    syllabusButton.click();
    fixture.detectChanges();

    expect(syllabusButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('renders child links within expanded groups', () => {
    fixture.detectChanges();

    const syllabusButton = fixture.nativeElement.querySelector(
      '.side-navigation-group-toggle',
    ) as HTMLButtonElement;
    syllabusButton.click();
    fixture.detectChanges();

    const childLink = fixture.nativeElement.querySelector(
      '.side-navigation-group-children a',
    ) as HTMLAnchorElement;

    expect(childLink).toBeTruthy();
    expect(childLink.getAttribute('href')).toBe('/dashboard/syllabus/topics');
  });

  it('emits selection event when a group child link is selected', () => {
    const onItemSelected = vi.fn();
    fixture.componentInstance.itemSelected.subscribe(onItemSelected);
    fixture.detectChanges();

    const syllabusButton = fixture.nativeElement.querySelector(
      '.side-navigation-group-toggle',
    ) as HTMLButtonElement;
    syllabusButton.click();
    fixture.detectChanges();

    const childLink = fixture.nativeElement.querySelector(
      '.side-navigation-group-children a',
    ) as HTMLAnchorElement;
    childLink.click();

    expect(onItemSelected).toHaveBeenCalledOnce();
  });

  it('sets aria-current on the active direct link when navigating to Dashboard', async () => {
    await router.navigateByUrl('/dashboard');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('[href="/dashboard"]') as HTMLAnchorElement;

    expect(link.classList.contains('active-link')).toBe(true);
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('sets aria-current on the Profile link when navigating to /dashboard/profile', async () => {
    await router.navigateByUrl('/dashboard/profile');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      '[href="/dashboard/profile"]',
    ) as HTMLAnchorElement;

    expect(link.classList.contains('active-link')).toBe(true);
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('omits active-link class on non-active links', async () => {
    await router.navigateByUrl('/dashboard/profile');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const dashboardLink = fixture.nativeElement.querySelector(
      '[href="/dashboard"]',
    ) as HTMLAnchorElement;

    expect(dashboardLink.classList.contains('active-link')).toBe(false);
  });

  it('marks the parent group as active when a child route is active', async () => {
    await router.navigateByUrl('/dashboard/syllabus/progress');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const groupButtons = fixture.nativeElement.querySelectorAll(
      '.side-navigation-group-toggle',
    ) as NodeListOf<HTMLButtonElement>;
    const syllabusButton = groupButtons[0] as HTMLButtonElement;

    expect(syllabusButton.classList.contains('active-link')).toBe(true);
  });

  it('marks the Review group as active when a Review child route is active', async () => {
    await router.navigateByUrl('/dashboard/review/flashcards');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const groupButtons = Array.from(
      fixture.nativeElement.querySelectorAll('.side-navigation-group-toggle'),
    ) as HTMLButtonElement[];
    const reviewButton = groupButtons.find((button) => button.textContent?.includes('Review'));

    expect(reviewButton).toBeDefined();
    expect(reviewButton?.classList.contains('active-link')).toBe(true);
  });

  it('does not mark a parent group as active for a path-prefixed sibling route', async () => {
    await router.navigateByUrl('/dashboard/syllabus/progress-extra');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const groupButtons = fixture.nativeElement.querySelectorAll(
      '.side-navigation-group-toggle',
    ) as NodeListOf<HTMLButtonElement>;
    const syllabusButton = groupButtons[0] as HTMLButtonElement;

    expect(syllabusButton.classList.contains('active-link')).toBe(false);
  });

  it('expands the parent group when a child route is active', async () => {
    await router.navigateByUrl('/dashboard/syllabus/progress');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const groupChildren = fixture.nativeElement.querySelector(
      '.side-navigation-group-children',
    ) as HTMLElement;

    expect(groupChildren).toBeTruthy();
    expect(groupChildren.textContent).toContain('Progress');
  });

  it('does not mark a group as active when a sibling child is active', async () => {
    await router.navigateByUrl('/dashboard/syllabus/progress');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    const groupButtons = fixture.nativeElement.querySelectorAll(
      '.side-navigation-group-toggle',
    ) as NodeListOf<HTMLButtonElement>;
    const testsButton = groupButtons[1] as HTMLButtonElement;

    expect(testsButton.classList.contains('active-link')).toBe(false);
  });
});
