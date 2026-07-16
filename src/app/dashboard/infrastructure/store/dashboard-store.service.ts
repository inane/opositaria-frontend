import { signal, computed } from '@angular/core';
import { ListStudySpacesUseCase } from '../../application/ListStudySpacesUseCase';
import { SaveStudySpaceUseCase } from '../../application/SaveStudySpaceUseCase';
import { StudySpace, StudySpaceFilter } from '../../domain/entities/StudySpace';

export interface PendingSaveState {
  uploadedSourceCount: number;
  documentIds: string[];
}

export class DashboardStore {
  private readonly rawSpaces = signal<StudySpace[]>([]);
  private readonly activeFilterSignal = signal<StudySpaceFilter>('all');
  readonly activeFilter = this.activeFilterSignal.asReadonly();
  private readonly searchTerm = signal('');
  private readonly createFlowOpen = signal(false);
  private readonly pendingSave = signal<PendingSaveState | null>(null);
  private readonly validationMessage = signal('');

  readonly visibleSpaces = computed(() => {
    let spaces = this.rawSpaces();

    if (this.activeFilter() !== 'all') {
      spaces = spaces.filter((space) => StudySpace.matchesFilter(space, this.activeFilter()));
    }

    const term = this.searchTerm();
    if (term.length > 0) {
      spaces = spaces.filter((space) => space.matches(term));
    }

    return spaces;
  });

  readonly isCreateFlowOpen = this.createFlowOpen.asReadonly();
  readonly pendingSaveState = this.pendingSave.asReadonly();
  readonly emptyStateReason = computed<string | null>(() => {
    if (this.rawSpaces().length === 0) {
      return 'No study spaces yet';
    }
    if (this.visibleSpaces().length === 0) {
      return 'No study spaces match the current filter or search';
    }
    return null;
  });
  readonly saveValidationMessage = this.validationMessage.asReadonly();

  constructor(
    private readonly listUseCase: ListStudySpacesUseCase,
    private readonly saveUseCase: SaveStudySpaceUseCase,
  ) {}

  async init(): Promise<void> {
    try {
      const spaces = await this.listUseCase.execute({});
      this.rawSpaces.set(spaces);
    } catch {
      // Backend unavailable - show empty state
      this.rawSpaces.set([]);
    }
  }

  setFilter(filter: StudySpaceFilter): void {
    this.activeFilterSignal.set(filter);
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  openCreateFlow(): void {
    this.createFlowOpen.set(true);
    this.pendingSave.set(null);
    this.validationMessage.set('');
  }

  cancelCreation(): void {
    this.createFlowOpen.set(false);
    this.pendingSave.set(null);
    this.validationMessage.set('');
  }

  recordUploadedSources(sourceCount: number, documentIds: string[] = []): void {
    this.pendingSave.set({ uploadedSourceCount: sourceCount, documentIds });
    this.validationMessage.set('');
  }

  async savePendingSpace(name: string): Promise<void> {
    const pending = this.pendingSave();
    if (!pending) {
      return;
    }

    if (name.trim().length === 0) {
      this.validationMessage.set('A name is required to save the study space');
      return;
    }

    try {
      await this.saveUseCase.execute({
        name,
        uploadedSourceCount: pending.uploadedSourceCount,
        documentIds: pending.documentIds,
      });
      this.pendingSave.set(null);
      this.createFlowOpen.set(false);
      this.validationMessage.set('');
      await this.init();
    } catch {
      this.validationMessage.set('Could not create study space. Please try again.');
    }
  }

  skipSaving(): void {
    this.pendingSave.set(null);
    this.createFlowOpen.set(false);
    this.validationMessage.set('');
  }
}