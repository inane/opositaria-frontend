import {describe, it, expect} from 'vitest';
import {IngestionJob} from './IngestionJob';
import {IngestionStatus} from '../value-objects/IngestionStatus';

describe('The IngestionJob', () => {
  it('creates a job with pending status', () => {
    const job = IngestionJob.create('job-1');

    expect(job.jobId).toBe('job-1');
    expect(job.status).toBe(IngestionStatus.PENDING);
  });

  it('moves a pending job to processing', () => {
    const job = IngestionJob.create('job-1');

    const processingJob = job.startProcessing();

    expect(processingJob.status).toBe(IngestionStatus.PROCESSING);
  });

  it('completes a processing job', () => {
    const job = IngestionJob.create('job-1').startProcessing();

    const doneJob = job.complete();

    expect(doneJob.status).toBe(IngestionStatus.DONE);
  });

  it('marks a job as failed with a recovery message', () => {
    const job = IngestionJob.create('job-1').startProcessing();

    const failedJob = job.fail('Ingestion could not be completed');

    expect(failedJob.status).toBe(IngestionStatus.ERROR);
    expect(failedJob.recoveryMessage).toBe('Ingestion could not be completed');
  });
});
