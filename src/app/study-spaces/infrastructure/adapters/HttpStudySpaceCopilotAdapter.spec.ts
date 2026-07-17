import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpStudySpaceCopilotAdapter } from './HttpStudySpaceCopilotAdapter';

describe('The HttpStudySpaceCopilotAdapter', () => {
  let adapter: HttpStudySpaceCopilotAdapter;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpStudySpaceCopilotAdapter,
      ],
    });

    adapter = TestBed.inject(HttpStudySpaceCopilotAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps GET /study-spaces/{spaceId}/conversation success', async () => {
    const promise = adapter.getConversation('space-123');

    const req = httpMock.expectOne('/study-spaces/space-123/conversation');
    expect(req.request.method).toBe('GET');

    req.flush({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello',
          created_at: '2026-07-15T10:30:00Z',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Hi there!',
          created_at: '2026-07-15T10:30:05Z',
        },
      ],
    });

    const result = await promise;

    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].role).toBe('user');
    expect(result.messages[0].content).toBe('Hello');
    expect(result.messages[1].role).toBe('assistant');
  });

  it('maps POST /study-spaces/{spaceId}/conversation/messages body and response', async () => {
    const promise = adapter.sendMessage('space-123', 'What are the themes?');

    const req = httpMock.expectOne('/study-spaces/space-123/conversation/messages');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ content: 'What are the themes?' });

    req.flush({
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'What are the themes?',
          created_at: '2026-07-15T10:35:00Z',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'The themes are...',
          created_at: '2026-07-15T10:35:05Z',
        },
      ],
    });

    const result = await promise;

    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].content).toBe('What are the themes?');
    expect(result.messages[1].content).toBe('The themes are...');
  });

  it('maps DELETE /study-spaces/{spaceId}/conversation', async () => {
    const promise = adapter.clearConversation('space-123');

    const req = httpMock.expectOne('/study-spaces/space-123/conversation');
    expect(req.request.method).toBe('DELETE');

    req.flush({ messages: [] });

    await expect(promise).resolves.toBeUndefined();
  });

  it('maps copilot 404 to safe error', async () => {
    const promise = adapter.getConversation('missing-space');

    const req = httpMock.expectOne('/study-spaces/missing-space/conversation');
    req.flush(
      { detail: { code: 'NOT_FOUND', message: 'Study space not found' } },
      { status: 404, statusText: 'Not Found' },
    );

    await expect(promise).rejects.toMatchObject({
      type: 'notFound',
    });
  });
});
