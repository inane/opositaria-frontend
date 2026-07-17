import { InjectionToken } from '@angular/core';
import { StudySpaceDocumentsStore } from '../store/study-space-documents-store.service';

export const STUDY_SPACE_DOCUMENTS_STORE = new InjectionToken<StudySpaceDocumentsStore>(
  'STUDY_SPACE_DOCUMENTS_STORE',
);
