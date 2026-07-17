import { CopilotConversation } from '../domain/entities/CopilotConversation';
import { StudySpaceCopilotRepository } from '../domain/repositories/StudySpaceCopilotRepository';

export class GetStudySpaceConversationUseCase {
  constructor(private readonly repository: StudySpaceCopilotRepository) {}

  async execute(spaceId: string): Promise<CopilotConversation> {
    return this.repository.getConversation(spaceId);
  }
}
