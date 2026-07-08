import { Service, signal, inject } from '@angular/core';
import { SourceFile } from '../../domain/value-objects/SourceFile';
import { IngestionJob } from '../../domain/entities/IngestionJob';
import { DomainError } from '../../domain/DomainError';
import { SOURCE_INGESTION_PORT } from '../tokens/source-ingestion-port.token';
import { StartSourceIngestionUseCase } from '../../application/StartSourceIngestionUseCase';
import { GetSourceIngestionStatusUseCase } from '../../application/GetSourceIngestionStatusUseCase';
import { ValidateSourceFileUseCase } from '../../application/ValidateSourceFileUseCase';

@Service()
export class SourceIngestionStore {
  private readonly port = inject(SOURCE_INGESTION_PORT);
  private readonly startIngestionUseCase = new StartSourceIngestionUseCase(this.port);
  private readonly getStatusUseCase = new GetSourceIngestionStatusUseCase(this.port);
  private readonly validateSourceFileUseCase = new ValidateSourceFileUseCase();
  private readonly source = signal<SourceFile | null>(null);
  private readonly job = signal<IngestionJob | null>(null);
  private readonly validation = signal<string>('');

  readonly selectedSource = this.source.asReadonly();
  readonly ingestionJob = this.job.asReadonly();
  readonly validationMessage = this.validation.asReadonly();

  selectSource(file: File): void {
    try {
      const sourceFile = this.validateSourceFileUseCase.execute({
        name: file.name,
        size: file.size,
        type: file.type,
      });
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
  }

  async refreshStatus(): Promise<void> {
    const currentJob = this.job();
    if (!currentJob) {
      return;
    }

    const job = await this.getStatusUseCase.execute(currentJob.jobId);
    this.job.set(job);
  }
}
