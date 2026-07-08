import { describe, it, expect } from 'vitest';
import { IngestionStatus } from './IngestionStatus';

describe('The IngestionStatus', () => {
  it('exposes the expected status values', () => {
    expect(IngestionStatus.PENDING).toBe('PENDING');
    expect(IngestionStatus.PROCESSING).toBe('PROCESSING');
    expect(IngestionStatus.DONE).toBe('DONE');
    expect(IngestionStatus.ERROR).toBe('ERROR');
  });
});
