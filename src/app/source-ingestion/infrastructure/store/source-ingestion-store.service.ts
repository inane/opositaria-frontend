import { Injectable, signal, inject } from '@angular/core';
import { SourceFile } from '../../domain/value-objects/SourceFile';
import { IngestionJob } from '../../domain/entities/IngestionJob';
import { IngestionStatus } from '../../domain/value-objects/IngestionStatus';
import { DomainError } from '../../domain/DomainError';
import { SOURCE_INGESTION_PORT } from '../tokens/source-ingestion-port.token';
import { StartSourceIngestionUseCase } from '../../application/StartSourceIngestionUseCase';
import { GetSourceIngestionStatusUseCase } from '../../application/GetSourceIngestionStatusUseCase';
import { ValidateSourceFileUseCase } from '../../application/ValidateSourceFileUseCase';

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 60_000;

@Injectable({ providedIn: 'root' })
export class SourceIngestionStore {
  private readonly port = inject(SOURCE_INGESTION_PORT);
  private readonly startIngestionUseCase = new StartSourceIngestionUseCase(this.port);
  private readonly getStatusUseCase = new GetSourceIngestionStatusUseCase(this.port);
  private readonly validateSourceFileUseCase = new ValidateSourceFileUseCase();

  private readonly source = signal<SourceFile | null>(null);
  private readonly job = signal<IngestionJob | null>(null);
  private readonly validation = signal<string>('');
  private readonly polling = signal<boolean>(false);
  private readonly pollError = signal<string>('');

  private pollTimerId: ReturnType<typeof setInterval> | null = null;
  private pollTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private pollStartTime = 0;

  readonly selectedSource = this.source.asReadonly();
  readonly ingestionJob = this.job.asReadonly();
  readonly validationMessage = this.validation.asReadonly();
  readonly isPolling = this.polling.asReadonly();
  readonly pollingError = this.pollError.asReadonly();

  selectSource(file: File): void {
    try {
      const sourceFile = this.validateSourceFileUseCase.execute(file);
      this.source.set(sourceFile);
      this.validation.set('');
    } catch (error) {
      if (error instanceof DomainError) {
        this.source.set(null);
        this.validation.set(error.message);
        return;
      }
      throw error;
    }
  }

  async startIngestion(): Promise<void> {
    const selectedSource = this.source();
    if (!selectedSource) {
      return;
    }

    const job = await this.startIngestionUseCase.execute(selectedSource);
    this.job.set(job);
    this.startPolling();
  }

  async refreshStatus(): Promise<void> {
    const currentJob = this.job();
    if (!currentJob) {
      return;
    }

    const job = await this.getStatusUseCase.execute(currentJob.jobId);
    this.job.set(job);

    if (job.status === IngestionStatus.DONE || job.status === IngestionStatus.ERROR) {
      this.stopPolling();
    }
  }

  cancelIngestion(): void {
    this.stopPolling();
    this.job.set(null);
    this.pollError.set('');
  }

  private startPolling(): void {
    this.stopPolling();
    this.polling.set(true);
    this.pollError.set('');
    this.pollStartTime = Date.now();

    this.pollTimerId = setInterval(async () => {
      const elapsed = Date.now() - this.pollStartTime;
      if (elapsed >= POLL_TIMEOUT_MS) {
        this.stopPolling();
        this.pollError.set('The document is still processing. Please check back later.');
        return;
      }

      try {
        await this.refreshStatus();
      } catch {
        this.pollError.set('Failed to check processing status. Please try again.');
      }
    }, POLL_INTERVAL_MS);
  }

  private stopPolling(): void {
    this.polling.set(false);
    if (this.pollTimerId !== null) {
      clearInterval(this.pollTimerId);
      this.pollTimerId = null;
    }
    if (this.pollTimeoutId !== null) {
      clearTimeout(this.pollTimeoutId);
      this.pollTimeoutId = null;
    }
  }
}
