import { describe, it, expect, beforeEach } from 'vitest';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpSourceIngestionAdapter } from './HttpSourceIngestionAdapter';
import { SourceFile } from '../../domain/value-objects/SourceFile';
import { IngestionStatus } from '../../domain/value-objects/IngestionStatus';
import { DomainError } from '../../domain/DomainError';

describe('The HttpSourceIngestionAdapter', () => {
  let adapter: HttpSourceIngestionAdapter;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    adapter = TestBed.inject(HttpSourceIngestionAdapter);
  });

  describe('start', () => {
    it('uploads PDF as multipart to /study-documents/upload', async () => {
      const file = new File(['real pdf bytes'], 'exam.pdf', { type: 'application/pdf' });
      const sourceFile = SourceFile.create(file);

      const promise = adapter.start(sourceFile);

      const req = httpMock.expectOne('/study-documents/upload');
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      const uploadedFile = (req.request.body as FormData).get('file') as File;
      expect(uploadedFile.name).toBe(file.name);
      expect(uploadedFile.size).toBe(file.size);
      expect(uploadedFile.type).toBe(file.type);

      req.flush({ document_id: 'doc-123', status: 'PENDING_PROCESSING' });
      httpMock.verify();

      const job = await promise;
      expect(job.jobId).toBe('doc-123');
      expect(job.status).toBe(IngestionStatus.PENDING);
    });

    it('maps backend validation errors to domain errors', async () => {
      const sourceFile = SourceFile.create({
        name: 'exam.pdf',
        size: 100,
        type: 'application/pdf',
      });

      const promise = adapter.start(sourceFile);

      const req = httpMock.expectOne('/study-documents/upload');
      req.flush(
        { detail: { code: 'invalid_file_type', message: 'Only PDF files are accepted' } },
        { status: 422, statusText: 'Unprocessable Content' },
      );
      httpMock.verify();

      await expect(promise).rejects.toThrow(DomainError);
    });

    it('maps 401 responses to unauthorized domain error', async () => {
      const sourceFile = SourceFile.create({
        name: 'exam.pdf',
        size: 1024,
        type: 'application/pdf',
      });

      const promise = adapter.start(sourceFile);

      const req = httpMock.expectOne('/study-documents/upload');
      req.flush(
        { detail: { code: 'unauthorized', message: 'Invalid credentials' } },
        { status: 401, statusText: 'Unauthorized' },
      );
      httpMock.verify();

      await expect(promise).rejects.toThrow(DomainError);
    });
  });

  describe('status', () => {
    it('fetches document status from backend', async () => {
      const promise = adapter.status('doc-123');

      const req = httpMock.expectOne('/study-documents/doc-123/status');
      expect(req.request.method).toBe('GET');

      req.flush({
        document_id: 'doc-123',
        filename: 'exam.pdf',
        status: 'READY',
        failure_reason: null,
        chunks_count: 5,
      });
      httpMock.verify();

      const job = await promise;
      expect(job.jobId).toBe('doc-123');
      expect(job.status).toBe(IngestionStatus.DONE);
    });

    it('maps failed backend status with failure reason', async () => {
      const promise = adapter.status('doc-123');

      const req = httpMock.expectOne('/study-documents/doc-123/status');
      req.flush({
        document_id: 'doc-123',
        filename: 'exam.pdf',
        status: 'FAILED',
        failure_reason: 'No extractable text found',
        chunks_count: 0,
      });
      httpMock.verify();

      const job = await promise;
      expect(job.status).toBe(IngestionStatus.ERROR);
      expect(job.recoveryMessage).toBe('No extractable text found');
    });
  });
});
