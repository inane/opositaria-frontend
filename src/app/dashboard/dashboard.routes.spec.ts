import { describe, expect, it } from 'vitest';
import { dashboardRoutes } from './dashboard.routes';
import { DashboardComponent } from './infrastructure/ui/dashboard-component';
import { EducationalPlaceholderComponent } from './infrastructure/ui/educational-placeholder.component';

describe('The dashboard routes', () => {
  it('renders the dashboard shell as the dashboard home', () => {
    const homeRoute = dashboardRoutes[0];

    expect(homeRoute.path).toBe('');
    expect(homeRoute.component).toBe(DashboardComponent);
  });

  it('loads source ingestion inside the dashboard home', async () => {
    const homeRoute = dashboardRoutes[0];
    const childRoute = homeRoute.children?.[0];

    const childRoutes = await childRoute?.loadChildren?.();

    expect(childRoute?.path).toBe('');
    expect(childRoutes).toEqual([{ path: '', component: expect.any(Function) }]);
  });

  it('resolves the profile route inside the dashboard shell', () => {
    const homeRoute = dashboardRoutes[0];
    const profileRoute = homeRoute.children?.find((r) => r.path === 'profile');

    expect(profileRoute).toBeDefined();
    expect(profileRoute?.component).toBe(EducationalPlaceholderComponent);
    expect(profileRoute?.data).toEqual({ title: 'Profile' });
  });

  it('resolves the settings route inside the dashboard shell', () => {
    const homeRoute = dashboardRoutes[0];
    const settingsRoute = homeRoute.children?.find((r) => r.path === 'settings');

    expect(settingsRoute).toBeDefined();
    expect(settingsRoute?.component).toBe(EducationalPlaceholderComponent);
    expect(settingsRoute?.data).toEqual({ title: 'Settings' });
  });

  it('resolves syllabus routes inside the dashboard shell', () => {
    const homeRoute = dashboardRoutes[0];
    const topicsRoute = homeRoute.children?.find((r) => r.path === 'syllabus/topics');
    const progressRoute = homeRoute.children?.find((r) => r.path === 'syllabus/progress');
    const favoritesRoute = homeRoute.children?.find((r) => r.path === 'syllabus/favorites');

    expect(topicsRoute).toBeDefined();
    expect(progressRoute).toBeDefined();
    expect(favoritesRoute).toBeDefined();
  });

  it('resolves tests routes inside the dashboard shell', () => {
    const homeRoute = dashboardRoutes[0];
    const newRoute = homeRoute.children?.find((r) => r.path === 'tests/new');
    const mockRoute = homeRoute.children?.find((r) => r.path === 'tests/mock-exams');
    const historyRoute = homeRoute.children?.find((r) => r.path === 'tests/history');
    const mistakesRoute = homeRoute.children?.find((r) => r.path === 'tests/mistakes');

    expect(newRoute).toBeDefined();
    expect(mockRoute).toBeDefined();
    expect(historyRoute).toBeDefined();
    expect(mistakesRoute).toBeDefined();
  });

  it('resolves planning routes inside the dashboard shell', () => {
    const homeRoute = dashboardRoutes[0];
    const calendarRoute = homeRoute.children?.find((r) => r.path === 'planning/calendar');
    const sessionsRoute = homeRoute.children?.find((r) => r.path === 'planning/sessions');
    const goalsRoute = homeRoute.children?.find((r) => r.path === 'planning/goals');

    expect(calendarRoute).toBeDefined();
    expect(sessionsRoute).toBeDefined();
    expect(goalsRoute).toBeDefined();
  });

  it('resolves statistics routes inside the dashboard shell', () => {
    const homeRoute = dashboardRoutes[0];
    const performanceRoute = homeRoute.children?.find((r) => r.path === 'statistics/performance');
    const evolutionRoute = homeRoute.children?.find((r) => r.path === 'statistics/evolution');
    const weakAreasRoute = homeRoute.children?.find((r) => r.path === 'statistics/weak-areas');

    expect(performanceRoute).toBeDefined();
    expect(evolutionRoute).toBeDefined();
    expect(weakAreasRoute).toBeDefined();
  });

  it('resolves review routes inside the dashboard shell', () => {
    const homeRoute = dashboardRoutes[0];
    const flashcardsRoute = homeRoute.children?.find((r) => r.path === 'review/flashcards');
    const failedQuestionsRoute = homeRoute.children?.find(
      (r) => r.path === 'review/failed-questions',
    );
    const spacedRepetitionRoute = homeRoute.children?.find(
      (r) => r.path === 'review/spaced-repetition',
    );

    expect(flashcardsRoute).toBeDefined();
    expect(failedQuestionsRoute).toBeDefined();
    expect(spacedRepetitionRoute).toBeDefined();
  });

  it('provides a fallback route for unknown dashboard paths', () => {
    const homeRoute = dashboardRoutes[0];
    const fallbackRoute = homeRoute.children?.find((r) => r.path === '**');

    expect(fallbackRoute).toBeDefined();
    expect(fallbackRoute?.redirectTo).toBe('');
  });
});
