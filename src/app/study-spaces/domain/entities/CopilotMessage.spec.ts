import { CopilotMessage } from './CopilotMessage';
import { DomainError } from '../DomainError';

describe('The CopilotMessage', () => {
  it('creates a valid user message with timestamp', () => {
    const createdAt = new Date('2026-07-15T10:35:00Z');

    const message = CopilotMessage.create({
      id: 'msg-123',
      role: 'user',
      content: 'What are the main themes?',
      createdAt,
    });

    expect(message.id).toBe('msg-123');
    expect(message.role).toBe('user');
    expect(message.content).toBe('What are the main themes?');
    expect(message.createdAt).toBe(createdAt);
  });

  it('creates a valid assistant message with timestamp', () => {
    const createdAt = new Date('2026-07-15T10:35:05Z');

    const message = CopilotMessage.create({
      id: 'msg-456',
      role: 'assistant',
      content: 'The main themes are...',
      createdAt,
    });

    expect(message.id).toBe('msg-456');
    expect(message.role).toBe('assistant');
    expect(message.content).toBe('The main themes are...');
    expect(message.createdAt).toBe(createdAt);
  });

  it('generates a UUID when no id is provided', () => {
    const message = CopilotMessage.create({
      role: 'user',
      content: 'Hello',
    });

    expect(message.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it('defaults createdAt to current date when not provided', () => {
    const before = new Date();

    const message = CopilotMessage.create({
      role: 'user',
      content: 'Hello',
    });

    const after = new Date();

    expect(message.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(message.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('rejects blank content', () => {
    expect(() =>
      CopilotMessage.create({ role: 'user', content: '' }),
    ).toThrow(DomainError);
  });

  it('rejects content with only whitespace', () => {
    expect(() =>
      CopilotMessage.create({ role: 'user', content: '   ' }),
    ).toThrow(DomainError);
  });
});
