import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpStudySpaceDocumentAdapter } from './HttpStudySpaceDocumentAdapter';

describe('The HttpStudySpaceDocumentAdapter', () => {
  let adapter: HttpStudySpaceDocumentAdapter;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpStudySpaceDocumentAdapter,
      ],
    });

    adapter = TestBed.inject(HttpStudySpaceDocumentAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps GET /study-spaces/{spaceId}/documents success', async () => {
    const promise = adapter.listBySpace('space-123');

    const req = httpMock.expectOne('/study-spaces/space-123/documents');
    expect(req.request.method).toBe('GET');

    req.flush([
      {
        id: 'doc-1',
        filename: 'notes.pdf',
        status: 'ready',
        chunks_count: 5,
        created_at: '2026-07-15T10:30:00Z',
        updated_at: '2026-07-15T10:35:00Z',
      },
      {
        id: 'doc-2',
        filename: 'slides.pdf',
        status: 'processing',
        chunks_count: 0,
        created_at: '2026-07-15T10:31:00Z',
        updated_at: '2026-07-15T10:31:00Z',
      },
    ]);

    const result = await promise;

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('doc-1');
    expect(result[0].filename).toBe('notes.pdf');
    expect(result[0].status).toBe('ready');
    expect(result[0].chunksCount).toBe(5);
    expect(result[1].id).toBe('doc-2');
    expect(result[1].status).toBe('processing');
  });

  it('maps document list 404/not-permitted to safe error', async () => {
    const promise = adapter.listBySpace('missing-space');

    const req = httpMock.expectOne('/study-spaces/missing-space/documents');
    req.flush(
      { detail: { code: 'NOT_FOUND', message: 'Study space not found' } },
      { status: 404, statusText: 'Not Found' },
    );

    await expect(promise).rejects.toMatchObject({
      type: 'notFound',
    });
  });

  it('adds a document via POST /study-spaces/{spaceId}/documents', async () => {
    const promise = adapter.addDocument('space-123', 'doc-456');

    const req = httpMock.expectOne('/study-spaces/space-123/documents');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ document_id: 'doc-456' });

    req.flush({});

    await expect(promise).resolves.toBeUndefined();
  });

  it('maps add-document 409 conflict to validation error', async () => {
    const promise = adapter.addDocument('space-123', 'doc-456');

    const req = httpMock.expectOne('/study-spaces/space-123/documents');
    req.flush(
      { detail: { code: 'CONFLICT', message: 'Document already in space' } },
      { status: 409, statusText: 'Conflict' },
    );

    await expect(promise).rejects.toMatchObject({
      type: 'validation',
    });
  });

  it('maps add-document 422 unready to validation error', async () => {
    const promise = adapter.addDocument('space-123', 'doc-456');

    const req = httpMock.expectOne('/study-spaces/space-123/documents');
    req.flush(
      { detail: { code: 'UNPROCESSABLE_ENTITY', message: 'Document not ready' } },
      { status: 422, statusText: 'Unprocessable Entity' },
    );

    await expect(promise).rejects.toMatchObject({
      type: 'validation',
    });
  });

  it('deletes a document via DELETE /study-spaces/{spaceId}/documents/{documentId}', async () => {
    const promise = adapter.deleteDocument('space-123', 'doc-456');

    const req = httpMock.expectOne('/study-spaces/space-123/documents/doc-456');
    expect(req.request.method).toBe('DELETE');

    req.flush({});

    await expect(promise).resolves.toBeUndefined();
  });

  it('maps delete failure to safe error', async () => {
    const promise = adapter.deleteDocument('space-123', 'doc-456');

    const req = httpMock.expectOne('/study-spaces/space-123/documents/doc-456');
    req.flush(
      { detail: { code: 'NOT_FOUND', message: 'Document not found' } },
      { status: 404, statusText: 'Not Found' },
    );

    await expect(promise).rejects.toMatchObject({
      type: 'notFound',
    });
  });
});
