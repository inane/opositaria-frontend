import { CopilotConversation } from './CopilotConversation';
import { CopilotMessage } from './CopilotMessage';

describe('The CopilotConversation', () => {
  it('preserves chronological messages', () => {
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

    const conversation = CopilotConversation.create([msg1, msg2]);

    expect(conversation.messages).toHaveLength(2);
    expect(conversation.messages[0].content).toBe('Hello');
    expect(conversation.messages[1].content).toBe('Hi there!');
  });

  it('starts with an empty message list', () => {
    const conversation = CopilotConversation.create([]);

    expect(conversation.messages).toHaveLength(0);
    expect(conversation.isEmpty).toBe(true);
  });

  it('reports non-empty when messages exist', () => {
    const msg = CopilotMessage.create({
      role: 'user',
      content: 'Question',
    });

    const conversation = CopilotConversation.create([msg]);

    expect(conversation.isEmpty).toBe(false);
  });

  it('appends a message and returns a new conversation', () => {
    const msg1 = CopilotMessage.create({
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
    });

    const conversation = CopilotConversation.create([msg1]);

    const msg2 = CopilotMessage.create({
      id: 'msg-2',
      role: 'assistant',
      content: 'Hi!',
    });

    const updated = conversation.append(msg2);

    expect(updated.messages).toHaveLength(2);
    expect(updated.messages[1].content).toBe('Hi!');
    expect(conversation.messages).toHaveLength(1);
  });
});
