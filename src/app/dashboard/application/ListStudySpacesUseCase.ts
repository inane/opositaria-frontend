import { StudySpace } from '../domain/entities/StudySpace';
import { StudySpaceRepository } from '../domain/repositories/StudySpaceRepository';

export interface ListStudySpacesQuery {
  /* empty for now, extended with filter/search in later tasks */
}

export class ListStudySpacesUseCase {
  constructor(private readonly repository: StudySpaceRepository) {}

  async execute(_query: ListStudySpacesQuery): Promise<StudySpace[]> {
    return this.repository.listAll();
  }
}