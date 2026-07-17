import { SendStudySpaceCopilotMessageUseCase } from './SendStudySpaceCopilotMessageUseCase';
import { InMemoryStudySpaceCopilotRepository } from '../domain/repositories/StudySpaceCopilotRepository';
import { DomainError } from '../domain/DomainError';

describe('The SendStudySpaceCopilotMessageUseCase', () => {
  it('sends a non-blank message and receives updated conversation', async () => {
    const repository = new InMemoryStudySpaceCopilotRepository();
    const useCase = new SendStudySpaceCopilotMessageUseCase(repository);

    const result = await useCase.execute('space-1', 'What are the themes?');

    expect(result.messages).toHaveLength(2);
    expect(result.messages[0].role).toBe('user');
    expect(result.messages[0].content).toBe('What are the themes?');
    expect(result.messages[1].role).toBe('assistant');
  });

  it('rejects blank messages before repository call', async () => {
    const repository = new InMemoryStudySpaceCopilotRepository();
    const useCase = new SendStudySpaceCopilotMessageUseCase(repository);

    await expect(useCase.execute('space-1', '')).rejects.toThrow();
    await expect(useCase.execute('space-1', '   ')).rejects.toThrow();

    const conversation = await repository.getConversation('space-1');
    expect(conversation.messages).toHaveLength(0);
  });

  it('throws DomainError for blank messages', async () => {
    const repository = new InMemoryStudySpaceCopilotRepository();
    const useCase = new SendStudySpaceCopilotMessageUseCase(repository);

    await expect(useCase.execute('space-1', '')).rejects.toMatchObject({
      type: 'validation',
    });
  });
});
