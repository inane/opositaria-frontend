import { ClearStudySpaceConversationUseCase } from './ClearStudySpaceConversationUseCase';
import { InMemoryStudySpaceCopilotRepository } from '../domain/repositories/StudySpaceCopilotRepository';
import { CopilotMessage } from '../domain/entities/CopilotMessage';

describe('The ClearStudySpaceConversationUseCase', () => {
  it('clears conversation history', async () => {
    const msg = CopilotMessage.create({
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
    });

    const conversations = new Map([['space-1', [msg]]]);
    const repository = new InMemoryStudySpaceCopilotRepository(conversations);
    const useCase = new ClearStudySpaceConversationUseCase(repository);

    await useCase.execute('space-1');

    const conversation = await repository.getConversation('space-1');
    expect(conversation.messages).toHaveLength(0);
    expect(conversation.isEmpty).toBe(true);
  });
});
