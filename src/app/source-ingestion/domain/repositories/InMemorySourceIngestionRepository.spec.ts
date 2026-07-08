import { describe, it, expect } from 'vitest';
import { InMemorySourceIngestionRepository } from './SourceIngestionRepository';
import { SourceFile } from '../value-objects/SourceFile';
import { IngestionStatus } from '../value-objects/IngestionStatus';

describe('The InMemorySourceIngestionRepository', () => {
  it('creates a job identifier when starting ingestion', async () => {
    const repository = new InMemorySourceIngestionRepository();
    const sourceFile = SourceFile.create({
      name: 'exam.pdf',
      size: 1024,
      type: 'application/pdf',
    });

    const job = await repository.start(sourceFile);

    expect(job.jobId).toBeDefined();
    expect(job.status).toBe(IngestionStatus.PENDING);
  });

  it('advances a pending job to processing when status is read', async () => {
    const repository = new InMemorySourceIngestionRepository();
    const sourceFile = SourceFile.create({
      name: 'exam.pdf',
      size: 1024,
      type: 'application/pdf',
    });
    const job = await repository.start(sourceFile);

    const updatedJob = await repository.status(job.jobId);

    expect(updatedJob.status).toBe(IngestionStatus.PROCESSING);
  });

  it('advances a processing job to done when status is read again', async () => {
    const repository = new InMemorySourceIngestionRepository();
    const sourceFile = SourceFile.create({
      name: 'exam.pdf',
      size: 1024,
      type: 'application/pdf',
    });
    const job = await repository.start(sourceFile);
    await repository.status(job.jobId);

    const doneJob = await repository.status(job.jobId);

    expect(doneJob.status).toBe(IngestionStatus.DONE);
  });

  it('simulates an error path when the source file name contains error', async () => {
    const repository = new InMemorySourceIngestionRepository();
    const sourceFile = SourceFile.create({
      name: 'error-exam.pdf',
      size: 1024,
      type: 'application/pdf',
    });
    const job = await repository.start(sourceFile);
    await repository.status(job.jobId);

    const failedJob = await repository.status(job.jobId);

    expect(failedJob.status).toBe(IngestionStatus.ERROR);
    expect(failedJob.recoveryMessage).toBe('Ingestion failed. Please try again.');
  });

  it('reports a not-found error for an unknown job identifier', async () => {
    const repository = new InMemorySourceIngestionRepository();

    await expect(repository.status('unknown-job')).rejects.toThrow('Job unknown-job not found');
  });

  it('keeps a done job unchanged on subsequent status reads', async () => {
    const repository = new InMemorySourceIngestionRepository();
    const sourceFile = SourceFile.create({
      name: 'exam.pdf',
      size: 1024,
      type: 'application/pdf',
    });
    const job = await repository.start(sourceFile);
    await repository.status(job.jobId);
    const doneJob = await repository.status(job.jobId);

    const stableJob = await repository.status(job.jobId);

    expect(stableJob.status).toBe(IngestionStatus.DONE);
    expect(stableJob.jobId).toBe(doneJob.jobId);
  });
});
