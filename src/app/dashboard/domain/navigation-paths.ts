export const navPaths = {
  dashboard: '/dashboard',
  syllabus: {
    root: '/dashboard/syllabus',
    topics: '/dashboard/syllabus/topics',
    progress: '/dashboard/syllabus/progress',
    favorites: '/dashboard/syllabus/favorites',
  },
  tests: {
    root: '/dashboard/tests',
    new: '/dashboard/tests/new',
    mockExams: '/dashboard/tests/mock-exams',
    history: '/dashboard/tests/history',
    mistakes: '/dashboard/tests/mistakes',
  },
  planning: {
    root: '/dashboard/planning',
    calendar: '/dashboard/planning/calendar',
    sessions: '/dashboard/planning/sessions',
    goals: '/dashboard/planning/goals',
  },
  statistics: {
    root: '/dashboard/statistics',
    performance: '/dashboard/statistics/performance',
    evolution: '/dashboard/statistics/evolution',
    weakAreas: '/dashboard/statistics/weak-areas',
  },
  review: {
    root: '/dashboard/review',
    flashcards: '/dashboard/review/flashcards',
    failedQuestions: '/dashboard/review/failed-questions',
    spacedRepetition: '/dashboard/review/spaced-repetition',
  },
  profile: '/dashboard/profile',
  settings: '/dashboard/settings',
} as const;
