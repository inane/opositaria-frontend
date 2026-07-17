import { StudySpaceCopilotRepository } from '../domain/repositories/StudySpaceCopilotRepository';

export class ClearStudySpaceConversationUseCase {
  constructor(private readonly repository: StudySpaceCopilotRepository) {}

  async execute(spaceId: string): Promise<void> {
    await this.repository.clearConversation(spaceId);
  }
}
