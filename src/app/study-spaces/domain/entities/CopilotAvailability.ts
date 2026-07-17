import { StudySpaceDocument } from './StudySpaceDocument';

export type CopilotAvailabilityState = 'empty' | 'processing' | 'no-ready-documents' | 'available';

export function deriveCopilotAvailability(documents: StudySpaceDocument[]): CopilotAvailabilityState {
  if (documents.length === 0) {
    return 'empty';
  }

  if (documents.some((doc) => doc.isProcessing)) {
    return 'processing';
  }

  if (!documents.some((doc) => doc.isReady)) {
    return 'no-ready-documents';
  }

  return 'available';
}
