import { describe, expect, it } from 'vitest';
import { ListStudySpacesUseCase } from './ListStudySpacesUseCase';
import { InMemoryStudySpaceRepository } from '../domain/repositories/StudySpaceRepository';
import { StudySpace } from '../domain/entities/StudySpace';

function createSpace(title: string, overrides: Partial<{ isOwned: boolean; isFeatured: boolean; sourceCount: number }> = {}): StudySpace {
  return StudySpace.create({
    title,
    isOwned: overrides.isOwned ?? false,
    isFeatured: overrides.isFeatured ?? false,
    sourceCount: overrides.sourceCount ?? 0,
  });
}

describe('The ListStudySpacesUseCase', () => {
  it('lists all study spaces from the repository', async () => {
    const space1 = createSpace('Algebraic Structures', { isOwned: true, sourceCount: 3 });
    const space2 = createSpace('Calculus Basics', { isFeatured: true, sourceCount: 5 });
    const repository = new InMemoryStudySpaceRepository([space1, space2]);
    const useCase = new ListStudySpacesUseCase(repository);

    const result = await useCase.execute({});

    expect(result).toHaveLength(2);
    expect(result).toContain(space1);
    expect(result).toContain(space2);
  });

  it('lists only featured study spaces when the featured filter is active', async () => {
    const owned = createSpace('My Space', { isOwned: true, sourceCount: 2 });
    const featured = createSpace('Featured Space', { isFeatured: true, sourceCount: 5 });
    const repository = new InMemoryStudySpaceRepository([owned, featured]);
    const useCase = new ListStudySpacesUseCase(repository);

    const result = await useCase.execute({ filter: 'featured' });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Featured Space');
  });

  it('lists only user-owned study spaces when the owned filter is active', async () => {
    const owned = createSpace('My Space', { isOwned: true, sourceCount: 2 });
    const other = createSpace('Other Space');
    const repository = new InMemoryStudySpaceRepository([owned, other]);
    const useCase = new ListStudySpacesUseCase(repository);

    const result = await useCase.execute({ filter: 'owned' });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('My Space');
  });

  it('combines active filter and search term together', async () => {
    const myAlgebra = createSpace('My Algebra Notes', { isOwned: true, sourceCount: 3 });
    const myGeometry = createSpace('Geometry Notes', { isOwned: true, sourceCount: 2 });
    const featuredAlgebra = createSpace('Algebra Textbook', { isFeatured: true, sourceCount: 10 });
    const repository = new InMemoryStudySpaceRepository([myAlgebra, myGeometry, featuredAlgebra]);
    const useCase = new ListStudySpacesUseCase(repository);

    const ownedAlgebraResult = await useCase.execute({ filter: 'owned', search: 'algebra' });

    expect(ownedAlgebraResult).toHaveLength(1);
    expect(ownedAlgebraResult[0].title).toBe('My Algebra Notes');
  });

  it('returns an empty list when no spaces match the search term', async () => {
    const space = createSpace('Algebraic Structures', { isOwned: true, sourceCount: 3 });
    const repository = new InMemoryStudySpaceRepository([space]);
    const useCase = new ListStudySpacesUseCase(repository);

    const result = await useCase.execute({ search: 'Geometry' });

    expect(result).toHaveLength(0);
  });
});