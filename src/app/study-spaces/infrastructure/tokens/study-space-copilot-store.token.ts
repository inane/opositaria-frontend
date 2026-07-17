import { InjectionToken } from '@angular/core';
import { StudySpaceCopilotStore } from '../store/study-space-copilot-store.service';

export const STUDY_SPACE_COPILOT_STORE = new InjectionToken<StudySpaceCopilotStore>(
  'STUDY_SPACE_COPILOT_STORE',
);
