import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {SourceIngestionStore} from './source-ingestion-store.service';
import {StartSourceIngestionUseCase} from '../../application/StartSourceIngestionUseCase';
import {SOURCE_INGESTION_GATEWAY} from '../../application/ports/SourceIngestionGateway';
import {IngestionJob} from '../../domain/entities/IngestionJob';
import {IngestionStatus} from '../../domain/value-objects/IngestionStatus';
import type {SourceIngestionGateway} from '../../application/ports/SourceIngestionGateway';

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

describe('The SourceIngestionStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: SOURCE_INGESTION_GATEWAY, useClass: InMemorySourceIngestionGateway},
        StartSourceIngestionUseCase,
        SourceIngestionStore,
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('exposes no selected source initially', () => {
    const store = TestBed.inject(SourceIngestionStore);

    expect(store.selectedSource()).toBeNull();
  });

  it('accepts a selected PDF file', () => {
    const store = TestBed.inject(SourceIngestionStore);
    const file = new File(['content'], 'exam.pdf', {type: 'application/pdf'});

    store.selectSource(file);

    expect(store.selectedSource()?.name).toBe('exam.pdf');
    expect(store.validationMessage()).toBe('');
  });

  it('rejects a selected non-PDF file and shows a validation message', () => {
    const store = TestBed.inject(SourceIngestionStore);
    const file = new File(['content'], 'exam.txt', {type: 'text/plain'});

    store.selectSource(file);

    expect(store.selectedSource()).toBeNull();
    expect(store.validationMessage()).toBe('Only PDF files are supported');
  });

  it('starts ingestion for the selected source and exposes the job', async () => {
    const store = TestBed.inject(SourceIngestionStore);
    const file = new File(['content'], 'exam.pdf', {type: 'application/pdf'});
    store.selectSource(file);

    await store.startIngestion();

    expect(store.ingestionJob()?.status).toBe(IngestionStatus.PENDING);
  });
});
