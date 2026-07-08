import { Component, inject } from '@angular/core';
import {
  AlertComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  PageHeaderComponent,
  PageSectionComponent,
  StatusPanelComponent,
  UploadDropzoneComponent,
} from '../../../shared/ui';
import { SourceIngestionStore } from '../store/source-ingestion-store.service';
import { IngestionStatus } from '../../domain/value-objects/IngestionStatus';

@Component({
  selector: 'app-source-ingestion',
  imports: [
    AlertComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    PageHeaderComponent,
    PageSectionComponent,
    StatusPanelComponent,
    UploadDropzoneComponent,
  ],
  template: `
    <opo-page-header
      title="Upload your study source"
      description="Start building your knowledge base by uploading a PDF from your exam syllabus."
    />

    <opo-page-section
      title="Source file"
      description="Select one PDF document from your exam syllabus to begin."
    >
      <opo-card>
        <opo-upload-dropzone
          label="Upload source"
          description="Only PDF files are supported in the initial MVP."
          accept=".pdf"
          (fileSelected)="onFileSelected($event)"
        />
      </opo-card>
    </opo-page-section>

    @if (store.validationMessage(); as message) {
      <opo-alert tone="error">{{ message }}</opo-alert>
    }

    @if (store.selectedSource(); as source) {
      <p class="selected-source">Selected: <opo-badge tone="info">{{ source.name }}</opo-badge></p>
    }

    <opo-button
      type="button"
      [disabled]="!store.selectedSource()"
      (pressed)="onStartIngestion()"
    >
      Start ingestion
    </opo-button>

    @if (store.ingestionJob(); as job) {
      <opo-status-panel
        [tone]="statusTone(job.status)"
        [title]="statusTitle(job.status)"
        [message]="statusMessage(job.status)"
      >
        @if (job.status === ingestionStatus.ERROR) {
          <opo-button
            type="button"
            data-testid="retry-ingestion"
            (pressed)="onStartIngestion()"
          >
            Try again
          </opo-button>
        }
      </opo-status-panel>
    }

    @if (store.ingestionJob()?.status === ingestionStatus.DONE) {
      <opo-page-section title="Study actions" description="These features will be available soon.">
        <opo-card variant="muted">
          <ul class="future-actions">
            <li>
              <opo-button type="button" variant="ghost" [disabled]="true" data-testid="action-chat">
                Chat with sources
              </opo-button>
            </li>
            <li>
              <opo-button type="button" variant="ghost" [disabled]="true" data-testid="action-summary">
                Summaries by topic
              </opo-button>
            </li>
            <li>
              <opo-button type="button" variant="ghost" [disabled]="true" data-testid="action-test">
                Automatic tests
              </opo-button>
            </li>
            <li>
              <opo-button type="button" variant="ghost" [disabled]="true" data-testid="action-plan">
                Adaptive plan
              </opo-button>
            </li>
            <li>
              <opo-button type="button" variant="ghost" [disabled]="true" data-testid="action-recommendations">
                Recommendations
              </opo-button>
            </li>
          </ul>
        </opo-card>
      </opo-page-section>
    }
  `,
  styleUrl: './source-ingestion.component.css',
})
export class SourceIngestionComponent {
  protected readonly store = inject(SourceIngestionStore);
  protected readonly ingestionStatus = IngestionStatus;

  onFileSelected(file: File): void {
    this.store.selectSource(file);
  }

  onStartIngestion(): void {
    this.store.startIngestion();
  }

  statusTone(status: IngestionStatus): 'neutral' | 'info' | 'success' | 'warning' | 'error' {
    switch (status) {
      case IngestionStatus.PENDING:
        return 'neutral';
      case IngestionStatus.PROCESSING:
        return 'info';
      case IngestionStatus.DONE:
        return 'success';
      case IngestionStatus.ERROR:
        return 'error';
    }
  }

  statusTitle(status: IngestionStatus): string {
    switch (status) {
      case IngestionStatus.PENDING:
        return 'Pending';
      case IngestionStatus.PROCESSING:
        return 'Processing';
      case IngestionStatus.DONE:
        return 'Done';
      case IngestionStatus.ERROR:
        return 'Error';
    }
  }

  statusMessage(status: IngestionStatus): string {
    switch (status) {
      case IngestionStatus.PENDING:
        return 'Your source has been received and is waiting to be processed.';
      case IngestionStatus.PROCESSING:
        return 'Your source is being processed.';
      case IngestionStatus.DONE:
        return 'Your source is ready to use.';
      case IngestionStatus.ERROR:
        return this.store.ingestionJob()?.recoveryMessage ?? 'Ingestion failed.';
    }
  }
}
