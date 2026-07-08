import {describe, it, expect} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {StartSourceIngestionUseCase} from './StartSourceIngestionUseCase';
import {IngestionJob} from '../domain/entities/IngestionJob';
import {IngestionStatus} from '../domain/value-objects/IngestionStatus';
import {DomainError} from '../domain/DomainError';
import {SOURCE_INGESTION_GATEWAY} from './ports/SourceIngestionGateway';
import type {SourceIngestionGateway} from './ports/SourceIngestionGateway';

class InMemorySourceIngestionGateway implements SourceIngestionGateway {
  private jobs: Map<string, IngestionJob> = new Map();

  async start(sourceFile: {name: string}): Promise<IngestionJob> {
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: SOURCE_INGESTION_GATEWAY, useClass: InMemorySourceIngestionGateway},
        StartSourceIngestionUseCase,
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('starts ingestion for a valid PDF source', async () => {
    const useCase = TestBed.inject(StartSourceIngestionUseCase);

    const job = await useCase.execute({name: 'exam.pdf', size: 1024, type: 'application/pdf'});

    expect(job.status).toBe(IngestionStatus.PENDING);
  });

  it('prevents ingestion for a non-PDF source', async () => {
    const useCase = TestBed.inject(StartSourceIngestionUseCase);

    await expect(useCase.execute({name: 'exam.txt', size: 1024, type: 'text/plain'})).rejects.toThrow(DomainError);
  });
});
