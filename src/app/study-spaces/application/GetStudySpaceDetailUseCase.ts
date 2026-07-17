import { StudySpaceDetail } from '../domain/entities/StudySpaceDetail';
import { StudySpaceDetailRepository } from '../domain/repositories/StudySpaceDetailRepository';

export class GetStudySpaceDetailUseCase {
  constructor(private readonly repository: StudySpaceDetailRepository) {}

  async execute(spaceId: string): Promise<StudySpaceDetail> {
    return this.repository.getById(spaceId);
  }
}
