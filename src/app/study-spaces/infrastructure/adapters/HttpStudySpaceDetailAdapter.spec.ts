import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpStudySpaceDetailAdapter } from './HttpStudySpaceDetailAdapter';

describe('The HttpStudySpaceDetailAdapter', () => {
  let adapter: HttpStudySpaceDetailAdapter;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpStudySpaceDetailAdapter,
      ],
    });

    adapter = TestBed.inject(HttpStudySpaceDetailAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps GET /study-spaces/{spaceId} success to StudySpaceDetail', async () => {
    const promise = adapter.getById('space-123');

    const req = httpMock.expectOne('/study-spaces/space-123');
    expect(req.request.method).toBe('GET');

    req.flush({
      id: 'space-123',
      name: 'My Study Space',
      document_count: 3,
      created_at: '2026-07-15T10:30:00Z',
    });

    const result = await promise;

    expect(result.id).toBe('space-123');
    expect(result.title).toBe('My Study Space');
    expect(result.documentCount).toBe(3);
    expect(result.createdAt).toEqual(new Date('2026-07-15T10:30:00Z'));
  });

  it('maps 404 to safe inaccessible-space error', async () => {
    const promise = adapter.getById('missing-space');

    const req = httpMock.expectOne('/study-spaces/missing-space');
    req.flush(
      { detail: { code: 'NOT_FOUND', message: 'Study space not found' } },
      { status: 404, statusText: 'Not Found' },
    );

    await expect(promise).rejects.toMatchObject({
      type: 'notFound',
      message: 'Study space not found or not accessible',
    });
  });

  it('does not fallback to list endpoint when dedicated detail endpoint exists', async () => {
    const promise = adapter.getById('space-123');

    const req = httpMock.expectOne('/study-spaces/space-123');
    expect(req.request.method).toBe('GET');

    req.flush({
      id: 'space-123',
      name: 'My Space',
      document_count: 1,
      created_at: '2026-07-15T10:30:00Z',
    });

    const result = await promise;
    expect(result.id).toBe('space-123');

    httpMock.expectNone('/study-spaces');
  });
});
