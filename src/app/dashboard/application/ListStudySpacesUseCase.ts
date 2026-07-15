import { StudySpace, StudySpaceFilter } from '../domain/entities/StudySpace';
import { StudySpaceRepository } from '../domain/repositories/StudySpaceRepository';

export interface ListStudySpacesQuery {
  filter?: StudySpaceFilter;
}

export class ListStudySpacesUseCase {
  constructor(private readonly repository: StudySpaceRepository) {}

  async execute(query: ListStudySpacesQuery): Promise<StudySpace[]> {
    const allSpaces = await this.repository.listAll();
    const activeFilter = query.filter ?? 'all';

    if (activeFilter === 'all') {
      return allSpaces;
    }

    return allSpaces.filter((space) => StudySpace.matchesFilter(space, activeFilter));
  }
}