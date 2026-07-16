import { describe, it, expect } from 'vitest';
import { IngestionStatus, fromBackendStatus } from './IngestionStatus';

describe('The IngestionStatus', () => {
  it('exposes the expected status values', () => {
    expect(IngestionStatus.PENDING).toBe('PENDING');
    expect(IngestionStatus.PROCESSING).toBe('PROCESSING');
    expect(IngestionStatus.DONE).toBe('DONE');
    expect(IngestionStatus.ERROR).toBe('ERROR');
  });
});

describe('The fromBackendStatus mapper', () => {
  it('maps PENDING_PROCESSING to PENDING', () => {
    const result = fromBackendStatus('PENDING_PROCESSING');
    expect(result.status).toBe(IngestionStatus.PENDING);
    expect(result.recoveryMessage).toBe('');
  });

  it('maps PROCESSING to PROCESSING', () => {
    const result = fromBackendStatus('PROCESSING');
    expect(result.status).toBe(IngestionStatus.PROCESSING);
  });

  it('maps READY to DONE', () => {
    const result = fromBackendStatus('READY');
    expect(result.status).toBe(IngestionStatus.DONE);
  });

  it('maps FAILED to ERROR with failure reason', () => {
    const result = fromBackendStatus('FAILED', 'No extractable text found');
    expect(result.status).toBe(IngestionStatus.ERROR);
    expect(result.recoveryMessage).toBe('No extractable text found');
  });

  it('maps FAILED to ERROR without failure reason', () => {
    const result = fromBackendStatus('FAILED');
    expect(result.status).toBe(IngestionStatus.ERROR);
    expect(result.recoveryMessage).toBe('');
  });

  it('maps unknown backend status to ERROR with generic message', () => {
    const result = fromBackendStatus('UNKNOWN_STATUS');
    expect(result.status).toBe(IngestionStatus.ERROR);
    expect(result.recoveryMessage).toBe('Unknown status received');
  });
});