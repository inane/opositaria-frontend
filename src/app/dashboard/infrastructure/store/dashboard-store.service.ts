import { signal, computed } from '@angular/core';
import { ListStudySpacesUseCase } from '../../application/ListStudySpacesUseCase';
import { StudySpace, StudySpaceFilter } from '../../domain/entities/StudySpace';

export class DashboardStore {
  private readonly rawSpaces = signal<StudySpace[]>([]);
  private readonly activeFilter = signal<StudySpaceFilter>('all');
  private readonly searchTerm = signal('');

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

  constructor(private readonly listUseCase: ListStudySpacesUseCase) {}

  async init(): Promise<void> {
    const spaces = await this.listUseCase.execute({});
    this.rawSpaces.set(spaces);
  }
}