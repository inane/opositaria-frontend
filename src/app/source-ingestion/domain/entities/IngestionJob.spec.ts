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
});
