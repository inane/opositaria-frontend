import { vi } from 'vitest';
import { StudySpaceDetailStore } from './study-space-detail-store.service';
import { InMemoryStudySpaceDetailRepository } from '../../domain/repositories/StudySpaceDetailRepository';
import { GetStudySpaceDetailUseCase } from '../../application/GetStudySpaceDetailUseCase';
import { StudySpaceDetail } from '../../domain/entities/StudySpaceDetail';

describe('The StudySpaceDetailStore', () => {
  it('initializes in idle state', () => {
    const repository = new InMemoryStudySpaceDetailRepository([]);
    const useCase = new GetStudySpaceDetailUseCase(repository);
    const store = new StudySpaceDetailStore(useCase);

    expect(store.loadingState()).toBe('idle');
    expect(store.detail()).toBeNull();
    expect(store.isLoading()).toBe(false);
  });

  it('loads detail from route-provided space id', async () => {
    const space = StudySpaceDetail.create({
      id: 'space-123',
      title: 'My Space',
      documentCount: 3,
    });

    const repository = new InMemoryStudySpaceDetailRepository([space]);
    const useCase = new GetStudySpaceDetailUseCase(repository);
    const store = new StudySpaceDetailStore(useCase);

    await store.load('space-123');

    expect(store.loadingState()).toBe('loaded');
    expect(store.detail()?.id).toBe('space-123');
    expect(store.detail()?.title).toBe('My Space');
    expect(store.isLoaded()).toBe(true);
  });

  it('sets inaccessible state for missing space', async () => {
    const repository = new InMemoryStudySpaceDetailRepository([]);
    const useCase = new GetStudySpaceDetailUseCase(repository);
    const store = new StudySpaceDetailStore(useCase);

    await store.load('missing-space');

    expect(store.loadingState()).toBe('inaccessible');
    expect(store.detail()).toBeNull();
    expect(store.isInaccessible()).toBe(true);
    expect(store.errorMessage()).toContain('not found');
  });

  it('sets error state for unexpected failures', async () => {
    const repository = new InMemoryStudySpaceDetailRepository([]);
    const useCase = new GetStudySpaceDetailUseCase(repository);
    const store = new StudySpaceDetailStore(useCase);

    const failSpy = vi.spyOn(useCase, 'execute').mockRejectedValue(new Error('Network error'));

    await store.load('space-1');

    expect(store.loadingState()).toBe('error');
    expect(store.detail()).toBeNull();
    expect(store.hasError()).toBe(true);
    expect(store.errorMessage()).toBe('Something went wrong. Please try again.');

    failSpy.mockRestore();
  });

  it('retries detail load after failure', async () => {
    const space = StudySpaceDetail.create({
      id: 'space-123',
      title: 'My Space',
      documentCount: 1,
    });

    const repository = new InMemoryStudySpaceDetailRepository([space]);
    const useCase = new GetStudySpaceDetailUseCase(repository);
    const store = new StudySpaceDetailStore(useCase);

    const failSpy = vi.spyOn(useCase, 'execute').mockRejectedValueOnce(new Error('Network error'));

    await store.load('space-123');
    expect(store.loadingState()).toBe('error');

    failSpy.mockRestore();

    await store.retry('space-123');
    expect(store.loadingState()).toBe('loaded');
    expect(store.detail()?.id).toBe('space-123');
  });
});
