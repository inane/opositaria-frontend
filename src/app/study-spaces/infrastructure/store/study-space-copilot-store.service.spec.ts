import { vi } from 'vitest';
import { StudySpaceCopilotStore } from './study-space-copilot-store.service';
import { InMemoryStudySpaceCopilotRepository } from '../../domain/repositories/StudySpaceCopilotRepository';
import { GetStudySpaceConversationUseCase } from '../../application/GetStudySpaceConversationUseCase';
import { SendStudySpaceCopilotMessageUseCase } from '../../application/SendStudySpaceCopilotMessageUseCase';
import { ClearStudySpaceConversationUseCase } from '../../application/ClearStudySpaceConversationUseCase';
import { CopilotMessage } from '../../domain/entities/CopilotMessage';

describe('The StudySpaceCopilotStore', () => {
  function createStore(conversations?: Map<string, CopilotMessage[]>) {
    const repository = new InMemoryStudySpaceCopilotRepository(conversations);
    const getUseCase = new GetStudySpaceConversationUseCase(repository);
    const sendUseCase = new SendStudySpaceCopilotMessageUseCase(repository);
    const clearUseCase = new ClearStudySpaceConversationUseCase(repository);
    return new StudySpaceCopilotStore(getUseCase, sendUseCase, clearUseCase);
  }

  it('loads copilot conversation history', async () => {
    const msg1 = CopilotMessage.create({
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
      createdAt: new Date('2026-07-15T10:30:00Z'),
    });

    const msg2 = CopilotMessage.create({
      id: 'msg-2',
      role: 'assistant',
      content: 'Hi there!',
      createdAt: new Date('2026-07-15T10:30:05Z'),
    });

    const conversations = new Map([['space-1', [msg1, msg2]]]);
    const store = createStore(conversations);

    await store.load('space-1');

    expect(store.isLoaded()).toBe(true);
    expect(store.conversation().messages).toHaveLength(2);
  });

  it('disables send when availability is not available', () => {
    const store = createStore();

    store.setAvailability('empty');
    expect(store.canSendMessage()).toBe(false);

    store.setAvailability('processing');
    expect(store.canSendMessage()).toBe(false);

    store.setAvailability('no-ready-documents');
    expect(store.canSendMessage()).toBe(false);

    store.setAvailability('available');
    expect(store.canSendMessage()).toBe(true);
  });

  it('sends a message and exposes pending answer state', async () => {
    const store = createStore();

    const sendPromise = store.send('space-1', 'What are the themes?');

    expect(store.isSending()).toBe(true);

    await sendPromise;

    expect(store.isSending()).toBe(false);
    expect(store.conversation().messages).toHaveLength(2);
    expect(store.conversation().messages[0].content).toBe('What are the themes?');
  });

  it('keeps history visible on send failure', async () => {
    const msg = CopilotMessage.create({
      id: 'msg-1',
      role: 'user',
      content: 'Previous message',
    });

    const conversations = new Map([['space-1', [msg]]]);
    const store = createStore(conversations);
    await store.load('space-1');

    const failSpy = vi.spyOn(store as any, 'sendMessageUseCase' as any, 'get').mockReturnValue({
      execute: vi.fn().mockRejectedValue(new Error('Network error')),
    });

    await store.send('space-1', 'New message');

    expect(store.sendErrorMessage()).toBe('Failed to send message. Please try again.');
    expect(store.conversation().messages).toHaveLength(1);
    expect(store.isSending()).toBe(false);

    failSpy.mockRestore();
  });

  it('clears conversation after confirmation', async () => {
    const msg = CopilotMessage.create({
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
    });

    const conversations = new Map([['space-1', [msg]]]);
    const store = createStore(conversations);
    await store.load('space-1');
    expect(store.conversation().messages).toHaveLength(1);

    await store.clear('space-1');

    expect(store.conversation().messages).toHaveLength(0);
    expect(store.conversation().isEmpty).toBe(true);
  });

  it('preserves history on clear failure', async () => {
    const msg = CopilotMessage.create({
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
    });

    const conversations = new Map([['space-1', [msg]]]);
    const store = createStore(conversations);
    await store.load('space-1');

    const failSpy = vi.spyOn(store as any, 'clearConversationUseCase' as any, 'get').mockReturnValue({
      execute: vi.fn().mockRejectedValue(new Error('Network error')),
    });

    await store.clear('space-1');

    expect(store.clearErrorMessage()).toBe('Failed to clear conversation. Please try again.');
    expect(store.conversation().messages).toHaveLength(1);
    expect(store.isClearing()).toBe(false);

    failSpy.mockRestore();
  });
});
