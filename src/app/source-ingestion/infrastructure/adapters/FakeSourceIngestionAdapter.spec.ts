import {describe, it, expect} from 'vitest';
import {FakeSourceIngestionAdapter} from './FakeSourceIngestionAdapter';
import {SourceFile} from '../../domain/value-objects/SourceFile';
import {IngestionStatus} from '../../domain/value-objects/IngestionStatus';

describe('The FakeSourceIngestionAdapter', () => {
  it('creates a job identifier when starting ingestion', async () => {
    const adapter = new FakeSourceIngestionAdapter();
    const sourceFile = SourceFile.create({name: 'exam.pdf', size: 1024, type: 'application/pdf'});

    const job = await adapter.start(sourceFile);

    expect(job.jobId).toBeDefined();
    expect(job.status).toBe(IngestionStatus.PENDING);
  });

  it('advances a pending job to processing when status is read', async () => {
    const adapter = new FakeSourceIngestionAdapter();
    const sourceFile = SourceFile.create({name: 'exam.pdf', size: 1024, type: 'application/pdf'});
    const job = await adapter.start(sourceFile);

    const updatedJob = await adapter.status(job.jobId);

    expect(updatedJob.status).toBe(IngestionStatus.PROCESSING);
  });

  it('advances a processing job to done when status is read again', async () => {
    const adapter = new FakeSourceIngestionAdapter();
    const sourceFile = SourceFile.create({name: 'exam.pdf', size: 1024, type: 'application/pdf'});
    const job = await adapter.start(sourceFile);
    await adapter.status(job.jobId);

    const doneJob = await adapter.status(job.jobId);

    expect(doneJob.status).toBe(IngestionStatus.DONE);
  });
});
