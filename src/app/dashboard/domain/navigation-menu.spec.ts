import { describe, expect, it } from 'vitest';
import { educationalMenu } from './navigation-menu';
import { NavigationGroup, NavigationLink } from './navigation-menu';
import { navPaths } from './navigation-paths';

describe('The educational navigation menu', () => {
  it('exposes Dashboard, Syllabus, Tests, Planning, Statistics, Review, Profile, and Settings as primary sections', () => {
    const labels = educationalMenu.map((entry) => entry.label);

    expect(labels).toContain('Dashboard');
    expect(labels).toContain('Syllabus');
    expect(labels).toContain('Tests');
    expect(labels).toContain('Planning');
    expect(labels).toContain('Statistics');
    expect(labels).toContain('Review');
    expect(labels).toContain('Profile');
    expect(labels).toContain('Settings');
  });

  it('has Dashboard as a direct navigation link', () => {
    const dashboard = educationalMenu.find((entry) => entry.label === 'Dashboard');

    expect(dashboard).toBeDefined();
    expect(dashboard!.type).toBe('link');
    expect((dashboard as NavigationLink).path).toBe(navPaths.dashboard);
  });

  it('has Syllabus as a group with My topics, Progress, and Favorites children', () => {
    const syllabus = educationalMenu.find((entry) => entry.label === 'Syllabus') as NavigationGroup;

    expect(syllabus).toBeDefined();
    expect(syllabus.type).toBe('group');
    expect(syllabus.children.map((c) => c.label)).toEqual(['My topics', 'Progress', 'Favorites']);
  });

  it('has Tests as a group with New test, Mock exams, History, and Frequent mistakes children', () => {
    const tests = educationalMenu.find((entry) => entry.label === 'Tests') as NavigationGroup;

    expect(tests).toBeDefined();
    expect(tests.type).toBe('group');
    expect(tests.children.map((c) => c.label)).toEqual([
      'New test',
      'Mock exams',
      'History',
      'Frequent mistakes',
    ]);
  });

  it('has Planning as a group with Calendar, Study sessions, and Goals children', () => {
    const planning = educationalMenu.find((entry) => entry.label === 'Planning') as NavigationGroup;

    expect(planning).toBeDefined();
    expect(planning.type).toBe('group');
    expect(planning.children.map((c) => c.label)).toEqual(['Calendar', 'Study sessions', 'Goals']);
  });

  it('has Statistics as a group with Performance, Evolution, and Weak areas children', () => {
    const statistics = educationalMenu.find(
      (entry) => entry.label === 'Statistics',
    ) as NavigationGroup;

    expect(statistics).toBeDefined();
    expect(statistics.type).toBe('group');
    expect(statistics.children.map((c) => c.label)).toEqual([
      'Performance',
      'Evolution',
      'Weak areas',
    ]);
  });

  it('has Review as a group with Flashcards, Failed questions, and Spaced repetition children', () => {
    const review = educationalMenu.find((entry) => entry.label === 'Review') as NavigationGroup;

    expect(review).toBeDefined();
    expect(review.type).toBe('group');
    expect(review.children.map((c) => c.label)).toEqual([
      'Flashcards',
      'Failed questions',
      'Spaced repetition',
    ]);
  });

  it('has Profile as a direct navigation link', () => {
    const profile = educationalMenu.find((entry) => entry.label === 'Profile');

    expect(profile).toBeDefined();
    expect(profile!.type).toBe('link');
    expect((profile as NavigationLink).path).toBe(navPaths.profile);
  });

  it('has Settings as a direct navigation link', () => {
    const settings = educationalMenu.find((entry) => entry.label === 'Settings');

    expect(settings).toBeDefined();
    expect(settings!.type).toBe('link');
    expect((settings as NavigationLink).path).toBe(navPaths.settings);
  });
});
