import { StudySpaceDocumentRepository } from '../domain/repositories/StudySpaceDocumentRepository';

export class DeleteStudySpaceDocumentUseCase {
  constructor(private readonly repository: StudySpaceDocumentRepository) {}

  async execute(spaceId: string, documentId: string): Promise<void> {
    await this.repository.deleteDocument(spaceId, documentId);
  }
}
