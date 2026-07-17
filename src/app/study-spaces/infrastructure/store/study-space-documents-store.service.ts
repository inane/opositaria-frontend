import { signal, computed } from '@angular/core';
import { ListStudySpaceDocumentsUseCase } from '../../application/ListStudySpaceDocumentsUseCase';
import { AddDocumentToStudySpaceUseCase } from '../../application/AddDocumentToStudySpaceUseCase';
import { DeleteStudySpaceDocumentUseCase } from '../../application/DeleteStudySpaceDocumentUseCase';
import { StudySpaceDocument } from '../../domain/entities/StudySpaceDocument';
import { deriveCopilotAvailability, CopilotAvailabilityState } from '../../domain/entities/CopilotAvailability';
import { DomainError } from '../../domain/DomainError';

export type DocumentsLoadingState = 'idle' | 'loading' | 'loaded' | 'error';

export class StudySpaceDocumentsStore {
  private readonly documentsSignal = signal<StudySpaceDocument[]>([]);
  private readonly loadingStateSignal = signal<DocumentsLoadingState>('idle');
  private readonly errorMessageSignal = signal('');
  private readonly pendingDeleteSignal = signal<StudySpaceDocument | null>(null);

  readonly documents = this.documentsSignal.asReadonly();
  readonly loadingState = this.loadingStateSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();
  readonly pendingDelete = this.pendingDeleteSignal.asReadonly();

  readonly isLoading = computed(() => this.loadingStateSignal() === 'loading');
  readonly isLoaded = computed(() => this.loadingStateSignal() === 'loaded');
  readonly hasError = computed(() => this.loadingStateSignal() === 'error');
  readonly hasProcessingDocuments = computed(() =>
    this.documentsSignal().some((doc) => doc.isProcessing),
  );
  readonly copilotAvailability = computed<CopilotAvailabilityState>(() =>
    deriveCopilotAvailability(this.documentsSignal()),
  );

  constructor(
    private readonly listUseCase: ListStudySpaceDocumentsUseCase,
    private readonly addDocumentUseCase: AddDocumentToStudySpaceUseCase,
    private readonly deleteDocumentUseCase: DeleteStudySpaceDocumentUseCase,
  ) {}

  async load(spaceId: string): Promise<void> {
    this.loadingStateSignal.set('loading');
    this.errorMessageSignal.set('');

    try {
      const documents = await this.listUseCase.execute(spaceId);
      this.documentsSignal.set(documents);
      this.loadingStateSignal.set('loaded');
    } catch {
      this.documentsSignal.set([]);
      this.loadingStateSignal.set('error');
      this.errorMessageSignal.set('Failed to load documents. Please try again.');
    }
  }

  async addDocument(spaceId: string, documentId: string): Promise<void> {
    try {
      await this.addDocumentUseCase.execute(spaceId, documentId);
      await this.load(spaceId);
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw DomainError.create('Failed to add document. Please try again.');
    }
  }

  requestDelete(document: StudySpaceDocument): void {
    this.pendingDeleteSignal.set(document);
  }

  cancelDelete(): void {
    this.pendingDeleteSignal.set(null);
  }

  async confirmDelete(spaceId: string): Promise<void> {
    const pending = this.pendingDeleteSignal();
    if (!pending) return;

    try {
      await this.deleteDocumentUseCase.execute(spaceId, pending.id);
      this.pendingDeleteSignal.set(null);
      await this.load(spaceId);
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }
      throw DomainError.create('Failed to delete document. Please try again.');
    }
  }
}
