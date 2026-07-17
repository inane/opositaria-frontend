import { GetStudySpaceDetailUseCase } from './GetStudySpaceDetailUseCase';
import { InMemoryStudySpaceDetailRepository } from '../domain/repositories/StudySpaceDetailRepository';
import { StudySpaceDetail } from '../domain/entities/StudySpaceDetail';
import { DomainError } from '../domain/DomainError';

describe('The GetStudySpaceDetailUseCase', () => {
  it('loads an owned study-space detail by id', async () => {
    const space = StudySpaceDetail.create({
      id: 'space-123',
      title: 'My Space',
      documentCount: 3,
    });

    const repository = new InMemoryStudySpaceDetailRepository([space]);
    const useCase = new GetStudySpaceDetailUseCase(repository);

    const result = await useCase.execute('space-123');

    expect(result.id).toBe('space-123');
    expect(result.title).toBe('My Space');
    expect(result.documentCount).toBe(3);
  });

  it('throws when space is not found', async () => {
    const repository = new InMemoryStudySpaceDetailRepository([]);
    const useCase = new GetStudySpaceDetailUseCase(repository);

    await expect(useCase.execute('missing-id')).rejects.toThrow(
      'Study space missing-id not found',
    );
  });

  it('throws a DomainError with notFound type for missing space', async () => {
    const repository = new InMemoryStudySpaceDetailRepository([]);
    const useCase = new GetStudySpaceDetailUseCase(repository);

    await expect(useCase.execute('missing-id')).rejects.toMatchObject({
      type: 'notFound',
      name: 'DomainError',
    });
  });
});
