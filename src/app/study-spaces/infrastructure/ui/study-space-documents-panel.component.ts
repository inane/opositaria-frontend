import { Component, input, output, signal, ElementRef, effect, viewChild } from '@angular/core';
import { StudySpaceDocument } from '../../domain/entities/StudySpaceDocument';
import { SourceIngestionComponent } from '../../../source-ingestion/infrastructure/ui/source-ingestion.component';

@Component({
  selector: 'app-study-space-documents-panel',
  imports: [SourceIngestionComponent],
  template: `
    <div class="documents-panel">
      <div class="documents-header">
        <h2>Documents</h2>
        @if (!isLoading() && !hasError()) {
          <button type="button" class="add-button" (click)="toggleUpload()">
            <span aria-hidden="true">+</span> Add document
          </button>
        }
      </div>
      @if (isLoading()) {
        <p class="loading-text">Loading documents...</p>
      } @else if (hasError()) {
        <div class="error-state" role="alert">
          <p>{{ errorMessage() }}</p>
          <button type="button" class="retry-button" (click)="retry.emit()">Retry</button>
        </div>
      } @else if (documents().length === 0 && !isUploading()) {
        <div class="empty-state">
          <p>No documents yet. Add a document to get started.</p>
        </div>
      } @else {
        <ul class="document-list" role="list">
          @for (doc of documents(); track doc.id) {
            <li class="document-item">
              <span class="document-filename">{{ doc.filename }}</span>
              <span class="document-status" [attr.data-status]="doc.status">{{ doc.status }}</span>
              <button
                type="button"
                class="delete-button"
                [attr.aria-label]="'Delete ' + doc.filename"
                (click)="requestDelete(doc)"
              >
                Delete
              </button>
            </li>
          }
        </ul>
      }
      @if (isUploading()) {
        <div class="upload-area">
          <app-source-ingestion (sourceIngested)="handleDocumentIngested($event)" />
          <button type="button" class="cancel-upload-button" (click)="toggleUpload()">Cancel</button>
        </div>
      }
      @if (addDocumentError()) {
        <div class="delete-error" role="alert">
          <p>{{ addDocumentError() }}</p>
          <button type="button" class="retry-button" (click)="retryAdd.emit()">Retry add</button>
        </div>
      }
      @if (deleteError()) {
        <div class="delete-error" role="alert">
          <p>{{ deleteError() }}</p>
          <button type="button" class="retry-button" (click)="retryDelete.emit()">Retry delete</button>
        </div>
      }
      @if (pendingDelete(); as document) {
        <section
          #deleteDialog
          class="confirmation"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-document-title"
          tabindex="-1"
          (keydown.escape)="cancelDelete()"
          (keydown.enter)="confirmDelete(document)"
        >
          <h3 id="delete-document-title">Delete document?</h3>
          <p>{{ document.filename }} will be removed from this study space.</p>
          <div class="confirmation-actions">
            <button type="button" class="cancel-button" (click)="cancelDelete()">Cancel</button>
            <button type="button" class="confirm-button" (click)="confirmDelete(document)">Delete document</button>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .documents-panel {
      background: var(--opo-color-surface);
      border-radius: var(--opo-radius-lg);
      padding: var(--opo-space-4);
      box-shadow: var(--opo-shadow-sm);
    }
    .documents-panel h2 {
      margin: 0;
      font-size: 1.125rem;
    }
    .documents-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--opo-space-3);
    }
    .add-button {
      min-height: 2.25rem;
      padding: var(--opo-space-1) var(--opo-space-3);
      border: 1px solid var(--opo-color-text-alpha-12);
      border-radius: var(--opo-radius-sm);
      background: var(--opo-color-surface);
      cursor: pointer;
      font-size: 0.8125rem;
    }
    .loading-text {
      color: var(--opo-color-text-muted);
    }
    .error-state {
      color: var(--opo-color-danger);
    }
    .retry-button {
      margin-top: var(--opo-space-2);
      padding: var(--opo-space-2) var(--opo-space-4);
      background: var(--opo-color-surface-muted);
      border: none;
      border-radius: var(--opo-radius-sm);
      cursor: pointer;
    }
    .empty-state {
      color: var(--opo-color-text-muted);
      text-align: center;
      padding: var(--opo-space-8) var(--opo-space-4);
    }
    .document-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .document-item {
      display: flex;
      gap: var(--opo-space-3);
      justify-content: space-between;
      align-items: center;
      padding: var(--opo-space-3) 0;
      border-bottom: 1px solid var(--opo-color-text-alpha-8);
    }
    .document-item:last-child {
      border-bottom: none;
    }
    .document-filename {
      font-weight: 500;
    }
    .document-status {
      font-size: 0.8125rem;
      color: var(--opo-color-text-muted);
    }
    .document-status[data-status="ready"] {
      color: var(--opo-color-success);
    }
    .document-status[data-status="processing"] {
      color: var(--opo-color-warning);
    }
    .document-status[data-status="error"] {
      color: var(--opo-color-danger);
    }
    .delete-button,
    .cancel-button,
    .confirm-button {
      min-height: 2.75rem;
      padding: var(--opo-space-2) var(--opo-space-3);
      border: 1px solid var(--opo-color-text-alpha-12);
      border-radius: var(--opo-radius-sm);
      background: var(--opo-color-surface);
      cursor: pointer;
    }
    .confirmation {
      margin-top: var(--opo-space-4);
      padding: var(--opo-space-4);
      border: 1px solid var(--opo-color-danger-alpha-20);
      border-radius: var(--opo-radius-md);
      background: var(--opo-color-danger-alpha-8);
    }
    .confirmation h3,
    .confirmation p {
      margin: 0 0 var(--opo-space-3);
    }
    .confirmation-actions {
      display: flex;
      gap: var(--opo-space-2);
    }
    .confirm-button {
      background: var(--opo-color-danger);
      color: var(--opo-color-primary-contrast);
      border-color: var(--opo-color-danger);
    }
    .delete-error {
      margin-top: var(--opo-space-3);
      padding: var(--opo-space-3);
      border: 1px solid var(--opo-color-danger-alpha-20);
      border-radius: var(--opo-radius-md);
      background: var(--opo-color-danger-alpha-8);
      color: var(--opo-color-danger);
    }
    .delete-error p {
      margin: 0 0 var(--opo-space-2);
    }
    .upload-area {
      margin-top: var(--opo-space-4);
      padding: var(--opo-space-4);
      border: 1px solid var(--opo-color-text-alpha-8);
      border-radius: var(--opo-radius-md);
      background: var(--opo-color-surface-muted);
    }
    .cancel-upload-button {
      margin-top: var(--opo-space-2);
      padding: var(--opo-space-2) var(--opo-space-4);
      background: var(--opo-color-surface-muted);
      border: none;
      border-radius: var(--opo-radius-sm);
      cursor: pointer;
    }
  `],
})
export class StudySpaceDocumentsPanelComponent {
  readonly documents = input.required<readonly StudySpaceDocument[]>();
  readonly isLoading = input(false);
  readonly hasError = input(false);
  readonly errorMessage = input('');
  readonly deleteError = input('');
  readonly addDocumentError = input('');
  readonly retry = output();
  readonly retryDelete = output();
  readonly retryAdd = output();
  readonly deleteDocument = output<StudySpaceDocument>();
  readonly addDocument = output<string>();

  readonly pendingDelete = signal<StudySpaceDocument | null>(null);
  readonly isUploading = signal(false);

  private readonly deleteDialog = viewChild<ElementRef<HTMLElement>>('deleteDialog');

  constructor() {
    effect(() => {
      const dialog = this.deleteDialog();
      if (dialog) {
        queueMicrotask(() => dialog.nativeElement.focus());
      }
    });
  }

  requestDelete(document: StudySpaceDocument): void {
    this.pendingDelete.set(document);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(document: StudySpaceDocument): void {
    this.deleteDocument.emit(document);
    this.pendingDelete.set(null);
  }

  toggleUpload(): void {
    this.isUploading.update((v) => !v);
  }

  handleDocumentIngested(event: { sourceCount: number; documentIds: string[] }): void {
    for (const documentId of event.documentIds) {
      this.addDocument.emit(documentId);
    }
    this.isUploading.set(false);
  }
}
