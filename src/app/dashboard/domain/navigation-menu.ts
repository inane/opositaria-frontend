import { navPaths } from './navigation-paths';

export interface NavigationLink {
  type: 'link';
  label: string;
  path: string;
}

export interface NavigationGroup {
  type: 'group';
  label: string;
  children: NavigationLink[];
}

export type NavigationEntry = NavigationLink | NavigationGroup;

export const educationalMenu: NavigationEntry[] = [
  { type: 'link', label: 'Dashboard', path: navPaths.dashboard },
  {
    type: 'group',
    label: 'Syllabus',
    children: [
      { type: 'link', label: 'My topics', path: navPaths.syllabus.topics },
      { type: 'link', label: 'Progress', path: navPaths.syllabus.progress },
      { type: 'link', label: 'Favorites', path: navPaths.syllabus.favorites },
    ],
  },
  {
    type: 'group',
    label: 'Tests',
    children: [
      { type: 'link', label: 'New test', path: navPaths.tests.new },
      { type: 'link', label: 'Mock exams', path: navPaths.tests.mockExams },
      { type: 'link', label: 'History', path: navPaths.tests.history },
      { type: 'link', label: 'Frequent mistakes', path: navPaths.tests.mistakes },
    ],
  },
  {
    type: 'group',
    label: 'Planning',
    children: [
      { type: 'link', label: 'Calendar', path: navPaths.planning.calendar },
      { type: 'link', label: 'Study sessions', path: navPaths.planning.sessions },
      { type: 'link', label: 'Goals', path: navPaths.planning.goals },
    ],
  },
  {
    type: 'group',
    label: 'Statistics',
    children: [
      { type: 'link', label: 'Performance', path: navPaths.statistics.performance },
      { type: 'link', label: 'Evolution', path: navPaths.statistics.evolution },
      { type: 'link', label: 'Weak areas', path: navPaths.statistics.weakAreas },
    ],
  },
  {
    type: 'group',
    label: 'Review',
    children: [
      { type: 'link', label: 'Flashcards', path: navPaths.review.flashcards },
      { type: 'link', label: 'Failed questions', path: navPaths.review.failedQuestions },
      { type: 'link', label: 'Spaced repetition', path: navPaths.review.spacedRepetition },
    ],
  },
  { type: 'link', label: 'Profile', path: navPaths.profile },
  { type: 'link', label: 'Settings', path: navPaths.settings },
];
