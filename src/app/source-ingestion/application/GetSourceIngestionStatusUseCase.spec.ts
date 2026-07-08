import {describe, it, expect} from 'vitest';
import {GetSourceIngestionStatusUseCase} from './GetSourceIngestionStatusUseCase';
import {IngestionJob} from '../domain/entities/IngestionJob';
import {IngestionStatus} from '../domain/value-objects/IngestionStatus';
import type {SourceIngestionGateway} from './ports/SourceIngestionGateway';

class InMemorySourceIngestionGateway implements SourceIngestionGateway {
  private jobs: Map<string, IngestionJob> = new Map();

  async start(): Promise<IngestionJob> {
    const job = IngestionJob.create('job-1');
    this.jobs.set(job.jobId, job);

    return job;
  }

  async status(jobId: string): Promise<IngestionJob> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    return job;
  }
}

describe('The GetSourceIngestionStatusUseCase', () => {
  it('retrieves the status of an ingestion job', async () => {
    const gateway = new InMemorySourceIngestionGateway();
    await gateway.start();
    const useCase = new GetSourceIngestionStatusUseCase(gateway);

    const job = await useCase.execute('job-1');

    expect(job.status).toBe(IngestionStatus.PENDING);
  });
});
