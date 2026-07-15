import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {
  PageHeaderComponent,
  PageSectionComponent,
  StatusPanelComponent,
  UploadDropzoneComponent,
} from '../../../shared/ui';
import { SourceIngestionStore } from '../store/source-ingestion-store.service';
import { IngestionStatus } from '../../domain/value-objects/IngestionStatus';
import { IngestionJob } from '../../domain/entities/IngestionJob';

@Component({
  selector: 'app-source-ingestion',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
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
      <mat-card>
        <mat-card-content>
          <opo-upload-dropzone
            label="Upload source"
            description="Only PDF files are supported in the initial MVP."
            accept=".pdf"
            (fileSelected)="onFileSelected($event)"
          />
        </mat-card-content>
      </mat-card>
    </opo-page-section>

    @if (store.validationMessage(); as message) {
      <div role="alert" class="validation-error">{{ message }}</div>
    }

    @if (store.selectedSource(); as source) {
      <p class="selected-source">
        Selected: <mat-chip>{{ source.name }}</mat-chip>
      </p>
    }

    <button
      mat-button
      type="button"
      [disabled]="!store.selectedSource()"
      (click)="onStartIngestion()"
    >
      Start ingestion
    </button>

    @if (store.ingestionJob(); as job) {
      <opo-status-panel [tone]="toneFor(job)" [title]="titleFor(job)" [message]="messageFor(job)">
        @if (job.status === ingestionStatus.PENDING || job.status === ingestionStatus.PROCESSING) {
          <button
            mat-button
            type="button"
            data-testid="refresh-ingestion"
            (click)="onRefreshStatus()"
          >
            Refresh status
          </button>
        }
        @if (job.status === ingestionStatus.ERROR) {
          <button
            mat-button
            type="button"
            data-testid="retry-ingestion"
            (click)="onStartIngestion()"
          >
            Try again
          </button>
        }
      </opo-status-panel>
    }

    @if (store.ingestionJob()?.status === ingestionStatus.DONE) {
      <opo-page-section title="Study actions" description="These features will be available soon.">
        <mat-card>
          <mat-card-content>
            <ul class="future-actions">
              <li>
                <button mat-button type="button" [disabled]="true" data-testid="action-chat">
                  Chat with sources
                </button>
              </li>
              <li>
                <button mat-button type="button" [disabled]="true" data-testid="action-summary">
                  Summaries by topic
                </button>
              </li>
              <li>
                <button mat-button type="button" [disabled]="true" data-testid="action-test">
                  Automatic tests
                </button>
              </li>
              <li>
                <button mat-button type="button" [disabled]="true" data-testid="action-plan">
                  Adaptive plan
                </button>
              </li>
              <li>
                <button
                  mat-button
                  type="button"
                  [disabled]="true"
                  data-testid="action-recommendations"
                >
                  Recommendations
                </button>
              </li>
            </ul>
          </mat-card-content>
        </mat-card>
      </opo-page-section>
    }
  `,
  styleUrl: './source-ingestion.component.css',
})
export class SourceIngestionComponent {
  readonly sourceIngested = output<{ sourceCount: number }>();
  protected readonly store = inject(SourceIngestionStore);
  protected readonly ingestionStatus = IngestionStatus;

  onFileSelected(file: File): void {
    this.store.selectSource(file);
  }

  async onStartIngestion(): Promise<void> {
    await this.store.startIngestion();
  }

  async onRefreshStatus(): Promise<void> {
    await this.store.refreshStatus();

    if (this.store.ingestionJob()?.status === IngestionStatus.DONE) {
      this.sourceIngested.emit({ sourceCount: 1 });
    }
  }

  toneFor(job: IngestionJob): 'neutral' | 'info' | 'success' | 'warning' | 'error' {
    switch (job.status) {
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

  titleFor(job: IngestionJob): string {
    switch (job.status) {
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

  messageFor(job: IngestionJob): string {
    switch (job.status) {
      case IngestionStatus.PENDING:
        return 'Your source has been received and is waiting to be processed.';
      case IngestionStatus.PROCESSING:
        return 'Your source is being processed.';
      case IngestionStatus.DONE:
        return 'Your source is ready to use.';
      case IngestionStatus.ERROR:
        return job.recoveryMessage ?? 'Ingestion failed.';
    }
  }
}
