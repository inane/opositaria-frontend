import { describe, expect, it } from 'vitest';
import { DashboardStore } from './dashboard-store.service';
import { InMemoryStudySpaceRepository } from '../../domain/repositories/StudySpaceRepository';
import { ListStudySpacesUseCase } from '../../application/ListStudySpacesUseCase';
import { StudySpace } from '../../domain/entities/StudySpace';

function createSpace(title: string, overrides: Partial<{ isOwned: boolean; isFeatured: boolean; sourceCount: number }> = {}): StudySpace {
  return StudySpace.create({
    title,
    isOwned: overrides.isOwned ?? false,
    isFeatured: overrides.isFeatured ?? false,
    sourceCount: overrides.sourceCount ?? 0,
  });
}

describe('The DashboardStore', () => {
  it('exposes all study spaces initially', async () => {
    const spaces = [createSpace('Algebra', { isOwned: true, sourceCount: 3 })];
    const repository = new InMemoryStudySpaceRepository(spaces);
    const listUseCase = new ListStudySpacesUseCase(repository);
    const store = new DashboardStore(listUseCase);

    await store.init();
    const visible = store.visibleSpaces();

    expect(visible).toHaveLength(1);
    expect(visible[0].title).toBe('Algebra');
  });
});