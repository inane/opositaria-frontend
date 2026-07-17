import { StudySpaceDocumentRepository } from '../domain/repositories/StudySpaceDocumentRepository';

export class AddDocumentToStudySpaceUseCase {
  constructor(private readonly repository: StudySpaceDocumentRepository) {}

  async execute(spaceId: string, documentId: string): Promise<void> {
    await this.repository.addDocument(spaceId, documentId);
  }
}
