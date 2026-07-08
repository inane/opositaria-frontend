import { Component, inject } from '@angular/core';
import { SourceIngestionStore } from '../store/source-ingestion-store.service';
import { IngestionStatus } from '../../domain/value-objects/IngestionStatus';

@Component({
  selector: 'app-source-ingestion',
  imports: [],
  template: `
    <section class="source-ingestion">
      <h1>Upload your study source</h1>
      <p>Start building your knowledge base by uploading a PDF from your exam syllabus.</p>

      <label for="source-file">Source file</label>
      <input
        id="source-file"
        type="file"
        accept=".pdf"
        aria-label="Select a PDF source file"
        (change)="onFileSelected($event)"
      />

      @if (store.validationMessage(); as message) {
        <p class="validation-message" role="alert">{{ message }}</p>
      }

      @if (store.selectedSource(); as source) {
        <p class="selected-source">Selected: {{ source.name }}</p>
      }

      <button type="button" [disabled]="!store.selectedSource()" (click)="onStartIngestion()">
        Start ingestion
      </button>

      @if (store.ingestionJob(); as job) {
        <p class="ingestion-status" aria-live="polite">
          @switch (job.status) {
            @case (ingestionStatus.PENDING) {
              Pending: your source has been received and is waiting to be processed.
            }
            @case (ingestionStatus.PROCESSING) {
              Processing: your source is being processed.
            }
            @case (ingestionStatus.DONE) {
              Done: your source is ready to use.
            }
            @case (ingestionStatus.ERROR) {
              Error: {{ job.recoveryMessage }}
              <button type="button" data-testid="retry-ingestion" (click)="onStartIngestion()">
                Try again
              </button>
            }
          }
        </p>
      }

      @if (store.ingestionJob()?.status === ingestionStatus.DONE) {
        <section class="future-actions" aria-label="Upcoming study actions">
          <h2>Study actions</h2>
          <ul>
            <li>
              <button type="button" data-testid="action-chat" aria-disabled="true" disabled>
                Chat with sources
              </button>
            </li>
            <li>
              <button type="button" data-testid="action-summary" aria-disabled="true" disabled>
                Summaries by topic
              </button>
            </li>
            <li>
              <button type="button" data-testid="action-test" aria-disabled="true" disabled>
                Automatic tests
              </button>
            </li>
            <li>
              <button type="button" data-testid="action-plan" aria-disabled="true" disabled>
                Adaptive plan
              </button>
            </li>
            <li>
              <button type="button" data-testid="action-recommendations" aria-disabled="true" disabled>
                Recommendations
              </button>
            </li>
          </ul>
        </section>
      }
    </section>
  `,
  styleUrl: './source-ingestion.component.css',
})
export class SourceIngestionComponent {
  protected readonly store = inject(SourceIngestionStore);
  protected readonly ingestionStatus = IngestionStatus;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.store.selectSource(file);
    }
  }

  onStartIngestion(): void {
    this.store.startIngestion();
  }
}
