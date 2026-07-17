import { signal, computed } from '@angular/core';
import { GetStudySpaceDetailUseCase } from '../../application/GetStudySpaceDetailUseCase';
import { StudySpaceDetail } from '../../domain/entities/StudySpaceDetail';
import { DomainError } from '../../domain/DomainError';

export type StudySpaceDetailLoadingState = 'idle' | 'loading' | 'loaded' | 'inaccessible' | 'error';

export class StudySpaceDetailStore {
  private readonly detailSignal = signal<StudySpaceDetail | null>(null);
  private readonly loadingStateSignal = signal<StudySpaceDetailLoadingState>('idle');
  private readonly errorMessageSignal = signal('');

  readonly detail = this.detailSignal.asReadonly();
  readonly loadingState = this.loadingStateSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();

  readonly isLoading = computed(() => this.loadingStateSignal() === 'loading');
  readonly isLoaded = computed(() => this.loadingStateSignal() === 'loaded');
  readonly isInaccessible = computed(() => this.loadingStateSignal() === 'inaccessible');
  readonly hasError = computed(() => this.loadingStateSignal() === 'error');

  constructor(private readonly getDetailUseCase: GetStudySpaceDetailUseCase) {}

  async load(spaceId: string): Promise<void> {
    this.loadingStateSignal.set('loading');
    this.errorMessageSignal.set('');

    try {
      const detail = await this.getDetailUseCase.execute(spaceId);
      this.detailSignal.set(detail);
      this.loadingStateSignal.set('loaded');
    } catch (error) {
      this.detailSignal.set(null);
      if (error instanceof DomainError && error.type === 'notFound') {
        this.loadingStateSignal.set('inaccessible');
        this.errorMessageSignal.set(error.message);
      } else {
        this.loadingStateSignal.set('error');
        this.errorMessageSignal.set('Something went wrong. Please try again.');
      }
    }
  }

  async retry(spaceId: string): Promise<void> {
    await this.load(spaceId);
  }
}
