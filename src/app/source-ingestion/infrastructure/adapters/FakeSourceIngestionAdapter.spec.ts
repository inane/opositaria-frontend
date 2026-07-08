import { describe, it, expect } from 'vitest';
import { FakeSourceIngestionAdapter } from './FakeSourceIngestionAdapter';
import { SourceFile } from '../../domain/value-objects/SourceFile';
import { IngestionStatus } from '../../domain/value-objects/IngestionStatus';

describe('The FakeSourceIngestionAdapter', () => {
  it('starts ingestion and advances the job status like the in-memory repository', async () => {
    const adapter = new FakeSourceIngestionAdapter();
    const sourceFile = SourceFile.create({
      name: 'exam.pdf',
      size: 1024,
      type: 'application/pdf',
    });

    const job = await adapter.start(sourceFile);

    expect(job.status).toBe(IngestionStatus.PENDING);

    const processingJob = await adapter.status(job.jobId);

    expect(processingJob.status).toBe(IngestionStatus.PROCESSING);
  });
});
