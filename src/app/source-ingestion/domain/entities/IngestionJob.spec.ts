import {describe, it, expect} from 'vitest';
import {IngestionJob} from './IngestionJob';

describe('The IngestionJob', () => {
  it('creates a job with pending status', () => {
    const job = IngestionJob.create('job-1');

    expect(job.jobId).toBe('job-1');
    expect(job.status).toBe('PENDING');
  });
});
