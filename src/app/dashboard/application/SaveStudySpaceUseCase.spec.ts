import { describe, expect, it } from 'vitest';
import { SaveStudySpaceUseCase } from './SaveStudySpaceUseCase';
import { InMemoryStudySpaceRepository } from '../domain/repositories/StudySpaceRepository';
import { DomainError } from '../domain/entities/DomainError';

describe('The SaveStudySpaceUseCase', () => {
  it('saves a named study space with a source count', async () => {
    const repository = new InMemoryStudySpaceRepository();
    const useCase = new SaveStudySpaceUseCase(repository);

    await useCase.execute({ name: 'My Study Space', uploadedSourceCount: 3 });

    const spaces = await repository.listAll();
    expect(spaces).toHaveLength(1);
    expect(spaces[0].title).toBe('My Study Space');
    expect(spaces[0].sourceCount).toBe(3);
    expect(spaces[0].isOwned).toBe(true);
  });

  it('prevents saving a study space without a name', async () => {
    const repository = new InMemoryStudySpaceRepository();
    const useCase = new SaveStudySpaceUseCase(repository);

    await expect(useCase.execute({ name: '', uploadedSourceCount: 2 })).rejects.toThrow(DomainError);
  });
});