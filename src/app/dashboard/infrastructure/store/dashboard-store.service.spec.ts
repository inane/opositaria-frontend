import { describe, expect, it } from 'vitest';
import { DashboardStore } from './dashboard-store.service';
import { InMemoryStudySpaceRepository } from '../../domain/repositories/StudySpaceRepository';
import { ListStudySpacesUseCase } from '../../application/ListStudySpacesUseCase';
import { SaveStudySpaceUseCase } from '../../application/SaveStudySpaceUseCase';
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
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    await store.init();
    const visible = store.visibleSpaces();

    expect(visible).toHaveLength(1);
    expect(visible[0].title).toBe('Algebra');
  });

  it('filters visible spaces when active filter is featured', async () => {
    const owned = createSpace('My Space', { isOwned: true });
    const featured = createSpace('Featured Space', { isFeatured: true });
    const repository = new InMemoryStudySpaceRepository([owned, featured]);
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    await store.init();
    store.setFilter('featured');
    const visible = store.visibleSpaces();

    expect(visible).toHaveLength(1);
    expect(visible[0].title).toBe('Featured Space');
  });

  it('filters visible spaces when active filter is owned', async () => {
    const owned = createSpace('My Space', { isOwned: true });
    const other = createSpace('Other Space');
    const repository = new InMemoryStudySpaceRepository([owned, other]);
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    await store.init();
    store.setFilter('owned');
    const visible = store.visibleSpaces();

    expect(visible).toHaveLength(1);
    expect(visible[0].title).toBe('My Space');
  });

  it('filters visible spaces by search term', async () => {
    const algebra = createSpace('Algebra Notes', { isOwned: true });
    const geometry = createSpace('Geometry Notes', { isFeatured: true });
    const repository = new InMemoryStudySpaceRepository([algebra, geometry]);
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    await store.init();
    store.setSearchTerm('algebra');
    const visible = store.visibleSpaces();

    expect(visible).toHaveLength(1);
    expect(visible[0].title).toBe('Algebra Notes');
  });

  it('exposes an empty-state reason when no spaces exist', async () => {
    const repository = new InMemoryStudySpaceRepository([]);
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    await store.init();

    expect(store.emptyStateReason()).toBe('No study spaces yet');
  });

  it('exposes an empty-state reason when no spaces match the filter', async () => {
    const space = createSpace('My Space', { isOwned: true });
    const repository = new InMemoryStudySpaceRepository([space]);
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    await store.init();
    store.setFilter('featured');

    expect(store.emptyStateReason()).toBe('No study spaces match the current filter or search');
  });

  it('opens and closes the create/upload flow', () => {
    const repository = new InMemoryStudySpaceRepository();
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    expect(store.isCreateFlowOpen()).toBe(false);

    store.openCreateFlow();

    expect(store.isCreateFlowOpen()).toBe(true);

    store.cancelCreation();

    expect(store.isCreateFlowOpen()).toBe(false);
  });

  it('records uploaded source count for pending save', () => {
    const repository = new InMemoryStudySpaceRepository();
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    store.openCreateFlow();
    store.recordUploadedSources(3);

    expect(store.pendingSaveState()).toEqual({ uploadedSourceCount: 3 });
  });

  it('saves a named pending study space and refreshes visible spaces', async () => {
    const repository = new InMemoryStudySpaceRepository();
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    await store.init();
    store.openCreateFlow();
    store.recordUploadedSources(2);
    await store.savePendingSpace('My Saved Space');

    expect(store.isCreateFlowOpen()).toBe(false);
    expect(store.pendingSaveState()).toBeNull();
    expect(store.visibleSpaces()).toHaveLength(1);
    expect(store.visibleSpaces()[0].title).toBe('My Saved Space');
  });

  it('refuses pending save with an empty name', () => {
    const repository = new InMemoryStudySpaceRepository();
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    store.openCreateFlow();
    store.recordUploadedSources(2);
    store.savePendingSpace('');

    expect(store.saveValidationMessage()).toBe('A name is required to save the study space');
  });

  it('skips saving after upload and clears the flow', () => {
    const repository = new InMemoryStudySpaceRepository();
    const store = new DashboardStore(
      new ListStudySpacesUseCase(repository),
      new SaveStudySpaceUseCase(repository),
    );

    store.openCreateFlow();
    store.recordUploadedSources(2);
    store.skipSaving();

    expect(store.isCreateFlowOpen()).toBe(false);
    expect(store.pendingSaveState()).toBeNull();
  });
});