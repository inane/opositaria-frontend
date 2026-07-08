import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {SourceIngestionStore} from './source-ingestion-store.service';

describe('The SourceIngestionStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
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
});
