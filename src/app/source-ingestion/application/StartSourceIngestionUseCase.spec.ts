import {describe, it, expect} from 'vitest';
import {StartSourceIngestionUseCase} from './StartSourceIngestionUseCase';
import {SourceFile} from '../domain/value-objects/SourceFile';
import {IngestionJob} from '../domain/entities/IngestionJob';
import {IngestionStatus} from '../domain/value-objects/IngestionStatus';
import type {SourceIngestionGateway} from './ports/SourceIngestionGateway';

class InMemorySourceIngestionGateway implements SourceIngestionGateway {
  private jobs: Map<string, IngestionJob> = new Map();

  async start(sourceFile: SourceFile): Promise<IngestionJob> {
    const job = IngestionJob.create(`job-${sourceFile.name}`);
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

describe('The StartSourceIngestionUseCase', () => {
  it('starts ingestion for a valid PDF source', async () => {
    const gateway = new InMemorySourceIngestionGateway();
    const useCase = new StartSourceIngestionUseCase(gateway);
    const sourceFile = SourceFile.create({name: 'exam.pdf', size: 1024, type: 'application/pdf'});

    const job = await useCase.execute(sourceFile);

    expect(job.status).toBe(IngestionStatus.PENDING);
  });
});
