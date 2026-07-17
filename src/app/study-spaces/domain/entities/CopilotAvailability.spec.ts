import { StudySpaceDocument } from './StudySpaceDocument';
import { deriveCopilotAvailability } from './CopilotAvailability';

describe('CopilotAvailability', () => {
  it('detects empty copilot availability when no documents exist', () => {
    const availability = deriveCopilotAvailability([]);

    expect(availability).toBe('empty');
  });

  it('blocks copilot while documents process', () => {
    const documents = [
      StudySpaceDocument.create({
        filename: 'notes.pdf',
        status: 'processing',
        chunksCount: 0,
      }),
    ];

    const availability = deriveCopilotAvailability(documents);

    expect(availability).toBe('processing');
  });

  it('blocks copilot while documents are pending processing', () => {
    const documents = [
      StudySpaceDocument.create({
        filename: 'notes.pdf',
        status: 'pending',
        chunksCount: 0,
      }),
    ];

    const availability = deriveCopilotAvailability(documents);

    expect(availability).toBe('processing');
  });

  it('detects missing ready copilot context when documents exist but none are ready', () => {
    const documents = [
      StudySpaceDocument.create({
        filename: 'slides.pdf',
        status: 'error',
        chunksCount: 0,
      }),
    ];

    const availability = deriveCopilotAvailability(documents);

    expect(availability).toBe('no-ready-documents');
  });

  it('allows copilot with ready documents', () => {
    const documents = [
      StudySpaceDocument.create({
        filename: 'notes.pdf',
        status: 'ready',
        chunksCount: 5,
      }),
    ];

    const availability = deriveCopilotAvailability(documents);

    expect(availability).toBe('available');
  });

  it('blocks copilot when some documents are ready but at least one is processing', () => {
    const documents = [
      StudySpaceDocument.create({
        filename: 'notes.pdf',
        status: 'ready',
        chunksCount: 5,
      }),
      StudySpaceDocument.create({
        filename: 'slides.pdf',
        status: 'processing',
        chunksCount: 0,
      }),
    ];

    const availability = deriveCopilotAvailability(documents);

    expect(availability).toBe('processing');
  });
});
