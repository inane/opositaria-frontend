import { describe, expect, it } from 'vitest';
import { ListStudySpacesUseCase } from './ListStudySpacesUseCase';
import { InMemoryStudySpaceRepository } from '../domain/repositories/StudySpaceRepository';
import { StudySpace } from '../domain/entities/StudySpace';

describe('The ListStudySpacesUseCase', () => {
  it('lists all study spaces from the repository', async () => {
    const space1 = StudySpace.create({
      title: 'Algebraic Structures',
      isOwned: true,
      isFeatured: false,
      sourceCount: 3,
    });
    const space2 = StudySpace.create({
      title: 'Calculus Basics',
      isOwned: false,
      isFeatured: true,
      sourceCount: 5,
    });
    const repository = new InMemoryStudySpaceRepository([space1, space2]);
    const useCase = new ListStudySpacesUseCase(repository);

    const result = await useCase.execute({});

    expect(result).toHaveLength(2);
    expect(result).toContain(space1);
    expect(result).toContain(space2);
  });

  it('lists only featured study spaces when the featured filter is active', async () => {
    const owned = StudySpace.create({
      title: 'My Space',
      isOwned: true,
      isFeatured: false,
      sourceCount: 2,
    });
    const featured = StudySpace.create({
      title: 'Featured Space',
      isOwned: false,
      isFeatured: true,
      sourceCount: 5,
    });
    const repository = new InMemoryStudySpaceRepository([owned, featured]);
    const useCase = new ListStudySpacesUseCase(repository);

    const result = await useCase.execute({ filter: 'featured' });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Featured Space');
  });
});