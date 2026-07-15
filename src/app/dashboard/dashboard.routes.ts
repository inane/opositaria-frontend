import { Routes } from '@angular/router';
import { DashboardComponent } from './infrastructure/ui/dashboard-component';
import { EducationalPlaceholderComponent } from './infrastructure/ui/educational-placeholder.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../source-ingestion/source-ingestion.routes').then(
            (m) => m.sourceIngestionRoutes,
          ),
      },
      {
        path: 'profile',
        component: EducationalPlaceholderComponent,
        data: { title: 'Profile' },
      },
      {
        path: 'settings',
        component: EducationalPlaceholderComponent,
        data: { title: 'Settings' },
      },
      {
        path: 'syllabus/topics',
        component: EducationalPlaceholderComponent,
        data: { title: 'My topics' },
      },
      {
        path: 'syllabus/progress',
        component: EducationalPlaceholderComponent,
        data: { title: 'Progress' },
      },
      {
        path: 'syllabus/favorites',
        component: EducationalPlaceholderComponent,
        data: { title: 'Favorites' },
      },
      {
        path: 'tests/new',
        component: EducationalPlaceholderComponent,
        data: { title: 'New test' },
      },
      {
        path: 'tests/mock-exams',
        component: EducationalPlaceholderComponent,
        data: { title: 'Mock exams' },
      },
      {
        path: 'tests/history',
        component: EducationalPlaceholderComponent,
        data: { title: 'History' },
      },
      {
        path: 'tests/mistakes',
        component: EducationalPlaceholderComponent,
        data: { title: 'Frequent mistakes' },
      },
      {
        path: 'planning/calendar',
        component: EducationalPlaceholderComponent,
        data: { title: 'Calendar' },
      },
      {
        path: 'planning/sessions',
        component: EducationalPlaceholderComponent,
        data: { title: 'Study sessions' },
      },
      {
        path: 'planning/goals',
        component: EducationalPlaceholderComponent,
        data: { title: 'Goals' },
      },
      {
        path: 'statistics/performance',
        component: EducationalPlaceholderComponent,
        data: { title: 'Performance' },
      },
      {
        path: 'statistics/evolution',
        component: EducationalPlaceholderComponent,
        data: { title: 'Evolution' },
      },
      {
        path: 'statistics/weak-areas',
        component: EducationalPlaceholderComponent,
        data: { title: 'Weak areas' },
      },
      {
        path: 'review/flashcards',
        component: EducationalPlaceholderComponent,
        data: { title: 'Flashcards' },
      },
      {
        path: 'review/failed-questions',
        component: EducationalPlaceholderComponent,
        data: { title: 'Failed questions' },
      },
      {
        path: 'review/spaced-repetition',
        component: EducationalPlaceholderComponent,
        data: { title: 'Spaced repetition' },
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];
