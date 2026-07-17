import { StudySpaceDocument } from '../domain/entities/StudySpaceDocument';
import { StudySpaceDocumentRepository } from '../domain/repositories/StudySpaceDocumentRepository';

export class ListStudySpaceDocumentsUseCase {
  constructor(private readonly repository: StudySpaceDocumentRepository) {}

  async execute(spaceId: string): Promise<StudySpaceDocument[]> {
    return this.repository.listBySpace(spaceId);
  }
}
