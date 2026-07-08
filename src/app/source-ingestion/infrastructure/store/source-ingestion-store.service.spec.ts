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
});
