import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { SourceIngestionStore } from './source-ingestion-store.service';
import { SOURCE_INGESTION_PORT } from '../tokens/source-ingestion-port.token';
import { InMemorySourceIngestionRepository } from '../../domain/repositories/SourceIngestionRepository';
import { IngestionStatus } from '../../domain/value-objects/IngestionStatus';

describe('The SourceIngestionStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SOURCE_INGESTION_PORT, useClass: InMemorySourceIngestionRepository },
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
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });

    store.selectSource(file);

    expect(store.selectedSource()?.name).toBe('exam.pdf');
    expect(store.validationMessage()).toBe('');
  });

  it('keeps the selected PDF file content for upload', () => {
    const store = TestBed.inject(SourceIngestionStore);
    const file = new File(['real pdf bytes'], 'exam.pdf', { type: 'application/pdf' });

    store.selectSource(file);

    expect(store.selectedSource()?.content).toBe(file);
  });

  it('rejects a selected non-PDF file and shows a validation message', () => {
    const store = TestBed.inject(SourceIngestionStore);
    const file = new File(['content'], 'exam.txt', { type: 'text/plain' });

    store.selectSource(file);

    expect(store.selectedSource()).toBeNull();
    expect(store.validationMessage()).toBe('Only PDF files are supported');
  });

  it('starts ingestion for the selected source and exposes the job', async () => {
    const store = TestBed.inject(SourceIngestionStore);
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    store.selectSource(file);

    await store.startIngestion();

    expect(store.ingestionJob()?.status).toBe(IngestionStatus.PENDING);
  });

  it('does not start ingestion when no source is selected', async () => {
    const store = TestBed.inject(SourceIngestionStore);

    await store.startIngestion();

    expect(store.ingestionJob()).toBeNull();
  });

  it('refreshes the status of an existing ingestion job', async () => {
    const store = TestBed.inject(SourceIngestionStore);
    const file = new File(['content'], 'exam.pdf', { type: 'application/pdf' });
    store.selectSource(file);
    await store.startIngestion();

    await store.refreshStatus();

    expect(store.ingestionJob()?.status).toBe(IngestionStatus.PROCESSING);
  });

  it('does not refresh status when no job exists', async () => {
    const store = TestBed.inject(SourceIngestionStore);

    await store.refreshStatus();

    expect(store.ingestionJob()).toBeNull();
  });
});
