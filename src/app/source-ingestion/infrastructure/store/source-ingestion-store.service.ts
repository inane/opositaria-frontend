import {Injectable, signal, inject} from '@angular/core';
import {SourceFile} from '../../domain/value-objects/SourceFile';
import {IngestionJob} from '../../domain/entities/IngestionJob';
import {DomainError} from '../../domain/DomainError';
import {StartSourceIngestionUseCase} from '../../application/StartSourceIngestionUseCase';

@Injectable({
  providedIn: 'root',
})
export class SourceIngestionStore {
  private readonly startIngestionUseCase = inject(StartSourceIngestionUseCase);
  private readonly source = signal<SourceFile | null>(null);
  private readonly job = signal<IngestionJob | null>(null);
  private readonly validation = signal<string>('');

  readonly selectedSource = this.source.asReadonly();
  readonly ingestionJob = this.job.asReadonly();
  readonly validationMessage = this.validation.asReadonly();

  selectSource(file: File): void {
    try {
      const sourceFile = SourceFile.create({name: file.name, size: file.size, type: file.type});
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

    const job = await this.startIngestionUseCase.execute({
      name: selectedSource.name,
      size: selectedSource.size,
      type: selectedSource.type,
    });
    this.job.set(job);
  }
}
