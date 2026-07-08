import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {GetSourceIngestionStatusUseCase} from './GetSourceIngestionStatusUseCase';
import {IngestionJob} from '../domain/entities/IngestionJob';
import {IngestionStatus} from '../domain/value-objects/IngestionStatus';
import {SOURCE_INGESTION_GATEWAY} from './ports/SourceIngestionGateway';
import {SourceFile} from '../domain/value-objects/SourceFile';
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

describe('The GetSourceIngestionStatusUseCase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: SOURCE_INGESTION_GATEWAY, useClass: InMemorySourceIngestionGateway},
        GetSourceIngestionStatusUseCase,
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('retrieves the status of an ingestion job', async () => {
    const gateway = TestBed.inject(SOURCE_INGESTION_GATEWAY);
    const sourceFile = SourceFile.create({name: 'exam.pdf', size: 1024, type: 'application/pdf'});
    await gateway.start(sourceFile);
    const useCase = TestBed.inject(GetSourceIngestionStatusUseCase);

    const job = await useCase.execute('job-exam.pdf');

    expect(job.status).toBe(IngestionStatus.PENDING);
  });
});
