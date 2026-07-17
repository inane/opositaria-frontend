import { CopilotConversation } from '../domain/entities/CopilotConversation';
import { StudySpaceCopilotRepository } from '../domain/repositories/StudySpaceCopilotRepository';
import { DomainError } from '../domain/DomainError';

export class SendStudySpaceCopilotMessageUseCase {
  constructor(private readonly repository: StudySpaceCopilotRepository) {}

  async execute(spaceId: string, content: string): Promise<CopilotConversation> {
    if (content.trim().length === 0) {
      throw DomainError.createValidation('Message cannot be blank');
    }

    return this.repository.sendMessage(spaceId, content);
  }
}
