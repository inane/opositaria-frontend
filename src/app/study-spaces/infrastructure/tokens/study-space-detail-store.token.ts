import { InjectionToken } from '@angular/core';
import { StudySpaceDetailStore } from '../store/study-space-detail-store.service';

export const STUDY_SPACE_DETAIL_STORE = new InjectionToken<StudySpaceDetailStore>(
  'STUDY_SPACE_DETAIL_STORE',
);
