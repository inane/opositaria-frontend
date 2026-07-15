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
});