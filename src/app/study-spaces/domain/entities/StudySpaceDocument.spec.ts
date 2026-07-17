import { StudySpaceDocument } from './StudySpaceDocument';
import { DomainError } from '../DomainError';

describe('The StudySpaceDocument', () => {
  it('creates a document summary with filename, status, chunks count, and timestamps', () => {
    const createdAt = new Date('2026-07-15T10:30:00Z');
    const updatedAt = new Date('2026-07-15T10:35:00Z');

    const doc = StudySpaceDocument.create({
      id: 'doc-123',
      filename: 'lecture-notes.pdf',
      status: 'ready',
      chunksCount: 42,
      createdAt,
      updatedAt,
    });

    expect(doc.id).toBe('doc-123');
    expect(doc.filename).toBe('lecture-notes.pdf');
    expect(doc.status).toBe('ready');
    expect(doc.chunksCount).toBe(42);
    expect(doc.createdAt).toBe(createdAt);
    expect(doc.updatedAt).toBe(updatedAt);
  });

  it('generates a UUID when no id is provided', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 0,
    });

    expect(doc.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('defaults timestamps to current date when not provided', () => {
    const before = new Date();

    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 0,
    });

    const after = new Date();

    expect(doc.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(doc.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    expect(doc.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(doc.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('derives processing state from pending status', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'pending',
      chunksCount: 0,
    });

    expect(doc.isProcessing).toBe(true);
  });

  it('derives processing state from processing status', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'processing',
      chunksCount: 0,
    });

    expect(doc.isProcessing).toBe(true);
  });

  it('derives non-processing state from ready status', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    expect(doc.isProcessing).toBe(false);
  });

  it('derives non-processing state from error status', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'error',
      chunksCount: 0,
    });

    expect(doc.isProcessing).toBe(false);
  });

  it('derives ready state from ready status', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    expect(doc.isReady).toBe(true);
  });

  it('derives non-ready state from pending status', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'pending',
      chunksCount: 0,
    });

    expect(doc.isReady).toBe(false);
  });

  it('derives non-ready state from processing status', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'processing',
      chunksCount: 0,
    });

    expect(doc.isReady).toBe(false);
  });

  it('derives non-ready state from error status', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'error',
      chunksCount: 0,
    });

    expect(doc.isReady).toBe(false);
  });

  it('rejects negative chunk counts', () => {
    expect(() =>
      StudySpaceDocument.create({
        filename: 'notes.pdf',
        status: 'ready',
        chunksCount: -1,
      }),
    ).toThrow(DomainError);
  });

  it('allows zero chunk counts', () => {
    const doc = StudySpaceDocument.create({
      filename: 'notes.pdf',
      status: 'pending',
      chunksCount: 0,
    });

    expect(doc.chunksCount).toBe(0);
  });
});
