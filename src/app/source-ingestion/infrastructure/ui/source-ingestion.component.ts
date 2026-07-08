import {Component, inject} from '@angular/core';
import {SourceIngestionStore} from '../store/source-ingestion-store.service';
import {IngestionStatus} from '../../domain/value-objects/IngestionStatus';

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

      @if (store.selectedSource(); as source) {
        <p class="selected-source">Selected: {{ source.name }}</p>
      }

      <button
        type="button"
        [disabled]="!store.selectedSource()"
        (click)="onStartIngestion()"
      >
        Start ingestion
      </button>

      @if (store.ingestionJob(); as job) {
        <p class="ingestion-status">
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
              <button
                type="button"
                data-testid="retry-ingestion"
                (click)="onStartIngestion()"
              >
                Try again
              </button>
            }
          }
        </p>
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
