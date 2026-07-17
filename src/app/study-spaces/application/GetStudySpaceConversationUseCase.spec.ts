import { GetStudySpaceConversationUseCase } from './GetStudySpaceConversationUseCase';
import { InMemoryStudySpaceCopilotRepository } from '../domain/repositories/StudySpaceCopilotRepository';
import { CopilotMessage } from '../domain/entities/CopilotMessage';

describe('The GetStudySpaceConversationUseCase', () => {
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
    const repository = new InMemoryStudySpaceCopilotRepository(conversations);
    const useCase = new GetStudySpaceConversationUseCase(repository);

    const result = await useCase.execute('space-1');

    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].content).toBe('Hello');
    expect(result.messages[1].content).toBe('Hi there!');
  });

  it('returns empty conversation for space with no history', async () => {
    const repository = new InMemoryStudySpaceCopilotRepository();
    const useCase = new GetStudySpaceConversationUseCase(repository);

    const result = await useCase.execute('space-1');

    expect(result.messages).toHaveLength(0);
    expect(result.isEmpty).toBe(true);
  });
});
