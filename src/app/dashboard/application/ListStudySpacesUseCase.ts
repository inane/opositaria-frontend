import { StudySpace, StudySpaceFilter } from '../domain/entities/StudySpace';
import { StudySpaceRepository } from '../domain/repositories/StudySpaceRepository';

export interface ListStudySpacesQuery {
  filter?: StudySpaceFilter;
  search?: string;
}

export class ListStudySpacesUseCase {
  constructor(private readonly repository: StudySpaceRepository) {}

  async execute(query: ListStudySpacesQuery): Promise<StudySpace[]> {
    let allSpaces = await this.repository.listAll();

    const activeFilter = query.filter ?? 'all';
    if (activeFilter !== 'all') {
      allSpaces = allSpaces.filter((space) => StudySpace.matchesFilter(space, activeFilter));
    }

    const searchTerm = query.search;
    if (searchTerm !== undefined && searchTerm.length > 0) {
      allSpaces = allSpaces.filter((space) => space.matches(searchTerm));
    }

    return allSpaces;
  }
}