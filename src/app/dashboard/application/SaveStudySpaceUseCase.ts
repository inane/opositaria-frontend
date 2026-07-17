import { StudySpace } from '../domain/entities/StudySpace';
import { StudySpaceRepository } from '../domain/repositories/StudySpaceRepository';

export interface SaveStudySpaceRequest {
  name: string;
  uploadedSourceCount: number;
  documentIds?: string[];
}

export class SaveStudySpaceUseCase {
  constructor(private readonly repository: StudySpaceRepository) {}

  async execute(request: SaveStudySpaceRequest): Promise<StudySpace> {
    if (this.repository.createStudySpace && request.documentIds && request.documentIds.length > 0) {
      return this.repository.createStudySpace(request.name, request.documentIds);
    }

    const space = StudySpace.create({
      title: request.name,
      isOwned: true,
      isFeatured: false,
      sourceCount: request.uploadedSourceCount,
    });

    await this.repository.save(space);
    return space;
  }
}