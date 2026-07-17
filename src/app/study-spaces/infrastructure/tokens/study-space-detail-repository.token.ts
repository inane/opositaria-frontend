import { InjectionToken } from '@angular/core';
import { StudySpaceDetailRepository } from '../../domain/repositories/StudySpaceDetailRepository';

export const STUDY_SPACE_DETAIL_REPOSITORY = new InjectionToken<StudySpaceDetailRepository>(
  'STUDY_SPACE_DETAIL_REPOSITORY',
);
