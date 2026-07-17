import { InjectionToken } from '@angular/core';
import { StudySpaceDocumentRepository } from '../../domain/repositories/StudySpaceDocumentRepository';

export const STUDY_SPACE_DOCUMENT_REPOSITORY = new InjectionToken<StudySpaceDocumentRepository>(
  'STUDY_SPACE_DOCUMENT_REPOSITORY',
);
