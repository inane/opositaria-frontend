import { StudySpace } from '../domain/entities/StudySpace';
import { StudySpaceRepository } from '../domain/repositories/StudySpaceRepository';

export interface SaveStudySpaceRequest {
  name: string;
  uploadedSourceCount: number;
  documentIds?: string[];
}

export class SaveStudySpaceUseCase {
  constructor(private readonly repository: StudySpaceRepository) {}

  async execute(request: SaveStudySpaceRequest): Promise<void> {
    if (this.repository.createStudySpace && request.documentIds && request.documentIds.length > 0) {
      await this.repository.createStudySpace(request.name, request.documentIds);
      return;
    }

    const space = StudySpace.create({
      title: request.name,
      isOwned: true,
      isFeatured: false,
      sourceCount: request.uploadedSourceCount,
    });

    await this.repository.save(space);
  }
}