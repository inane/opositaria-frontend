import { InjectionToken } from '@angular/core';
import { StudySpaceCopilotRepository } from '../../domain/repositories/StudySpaceCopilotRepository';

export const STUDY_SPACE_COPILOT_REPOSITORY = new InjectionToken<StudySpaceCopilotRepository>(
  'STUDY_SPACE_COPILOT_REPOSITORY',
);
