import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StudySpaceDetailStore } from '../store/study-space-detail-store.service';
import { StudySpaceDocumentsStore } from '../store/study-space-documents-store.service';
import { StudySpaceCopilotStore } from '../store/study-space-copilot-store.service';
import { STUDY_SPACE_DETAIL_STORE } from '../tokens/study-space-detail-store.token';
import { STUDY_SPACE_DOCUMENTS_STORE } from '../tokens/study-space-documents-store.token';
import { STUDY_SPACE_COPILOT_STORE } from '../tokens/study-space-copilot-store.token';
import { StudySpaceDocumentsPanelComponent } from './study-space-documents-panel.component';
import { StudySpaceCopilotPanelComponent } from './study-space-copilot-panel.component';
import { StudySpaceDocument } from '../../domain/entities/StudySpaceDocument';

@Component({
  selector: 'app-study-space-detail-page',
  imports: [RouterLink, StudySpaceDocumentsPanelComponent, StudySpaceCopilotPanelComponent],
  template: `
    <div class="detail-page">
      @if (detailStore.isLoading()) {
        <div class="loading-state" role="status" aria-label="Loading study space">
          <p>Loading study space...</p>
        </div>
      } @else if (detailStore.isInaccessible()) {
        <div class="error-state" role="alert">
          <h2>Study space not found</h2>
          <p>{{ detailStore.errorMessage() }}</p>
          <a routerLink="/dashboard">Return to dashboard</a>
        </div>
      } @else if (detailStore.isLoaded()) {
        <header class="detail-header">
          <h1>{{ detailStore.detail()?.title }}</h1>
          <p>{{ detailStore.detail()?.documentCount }} documents</p>
        </header>
        <div class="detail-content">
          <app-study-space-documents-panel
            [documents]="documentsStore.documents()"
            [isLoading]="documentsStore.isLoading()"
            [hasError]="documentsStore.hasError()"
            [errorMessage]="documentsStore.errorMessage()"
            [deleteError]="deleteError()"
            [addDocumentError]="addDocumentError()"
            (retry)="loadDocuments()"
            (retryDelete)="retryDelete()"
            (retryAdd)="retryAdd()"
            (deleteDocument)="handleDeleteDocument($event)"
            (addDocument)="handleAddDocument($event)"
          />
          <app-study-space-copilot-panel
            [conversation]="copilotStore.conversation()"
            [isLoading]="copilotStore.isLoading()"
            [hasError]="copilotStore.hasError()"
            [errorMessage]="copilotStore.errorMessage()"
            [availability]="copilotStore.availability()"
            [canSendMessage]="copilotStore.canSendMessage()"
            [sendErrorMessage]="copilotStore.sendErrorMessage()"
            [clearErrorMessage]="copilotStore.clearErrorMessage()"
            (retry)="retry()"
            (sendMessage)="handleSendMessage($event)"
            (clearConversation)="handleClearConversation()"
          />
        </div>
      } @else if (detailStore.hasError()) {
        <div class="error-state" role="alert">
          <h2>Something went wrong</h2>
          <p>{{ detailStore.errorMessage() }}</p>
          <button type="button" (click)="retry()">Retry</button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--opo-color-page);
    }
    .detail-page {
      padding: var(--opo-space-6);
    }
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
    }
    .error-state {
      text-align: center;
      padding: var(--opo-space-8);
    }
    .detail-header {
      margin-bottom: var(--opo-space-6);
    }
    .detail-header h1 {
      margin: 0 0 var(--opo-space-1);
      font-size: 1.5rem;
    }
    .detail-header p {
      margin: 0;
      color: var(--opo-color-text-muted);
    }
    .detail-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--opo-space-6);
    }
    .documents-panel, .copilot-panel {
      background: var(--opo-color-surface);
      border-radius: var(--opo-radius-lg);
      padding: var(--opo-space-4);
      box-shadow: var(--opo-shadow-sm);
    }
    .documents-panel h2, .copilot-panel h2 {
      margin: 0 0 var(--opo-space-3);
      font-size: 1.125rem;
    }
    @media (max-width: 768px) {
      .detail-content {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class StudySpaceDetailPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  readonly detailStore = inject(StudySpaceDetailStore, { optional: true }) ?? inject(STUDY_SPACE_DETAIL_STORE);
  readonly documentsStore = inject(StudySpaceDocumentsStore, { optional: true }) ?? inject(STUDY_SPACE_DOCUMENTS_STORE);
  readonly copilotStore = inject(StudySpaceCopilotStore, { optional: true }) ?? inject(STUDY_SPACE_COPILOT_STORE);

  private spaceId = '';
  private routeSub: Subscription | null = null;
  readonly deleteError = signal('');
  readonly addDocumentError = signal('');

  ngOnInit(): void {
    this.routeSub = this.route.paramMap
      .pipe(
        map((params) => params.get('spaceId') ?? ''),
        filter((id) => id.length > 0),
      )
      .subscribe((spaceId) => {
        this.spaceId = spaceId;
        void this.loadAll();
      });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private async loadAll(): Promise<void> {
    await Promise.all([
      this.detailStore.load(this.spaceId),
      this.loadDocuments(),
      this.loadConversation(),
    ]);

    this.copilotStore.setAvailability(this.documentsStore.copilotAvailability());
  }

  async loadDocuments(): Promise<void> {
    await this.documentsStore.load(this.spaceId);
    this.copilotStore.setAvailability(this.documentsStore.copilotAvailability());
  }

  private async loadConversation(): Promise<void> {
    await this.copilotStore.load(this.spaceId);
  }

  async retry(): Promise<void> {
    this.deleteError.set('');
    await this.loadAll();
  }

  async retryDelete(): Promise<void> {
    const pending = this.documentsStore.pendingDelete();
    if (pending) {
      await this.handleDeleteDocument(pending);
    }
  }

  async handleSendMessage(content: string): Promise<void> {
    await this.copilotStore.send(this.spaceId, content);
  }

  async handleClearConversation(): Promise<void> {
    await this.copilotStore.clear(this.spaceId);
  }

  async handleDeleteDocument(document: StudySpaceDocument): Promise<void> {
    this.deleteError.set('');
    try {
      this.documentsStore.requestDelete(document);
      await this.documentsStore.confirmDelete(this.spaceId);
      this.copilotStore.setAvailability(this.documentsStore.copilotAvailability());
    } catch (error) {
      this.deleteError.set(error instanceof Error ? error.message : 'Failed to delete document. Please try again.');
    }
  }

  private lastAddedDocumentId = '';

  async handleAddDocument(documentId: string): Promise<void> {
    this.addDocumentError.set('');
    this.lastAddedDocumentId = documentId;
    try {
      await this.documentsStore.addDocument(this.spaceId, documentId);
      this.copilotStore.setAvailability(this.documentsStore.copilotAvailability());
    } catch (error) {
      this.addDocumentError.set(error instanceof Error ? error.message : 'Failed to add document. Please try again.');
    }
  }

  async retryAdd(): Promise<void> {
    if (this.lastAddedDocumentId) {
      await this.handleAddDocument(this.lastAddedDocumentId);
    }
  }
}
