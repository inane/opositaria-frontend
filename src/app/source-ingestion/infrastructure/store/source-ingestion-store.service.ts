import {Injectable, signal} from '@angular/core';
import {SourceFile} from '../../domain/value-objects/SourceFile';
import {IngestionJob} from '../../domain/entities/IngestionJob';

@Injectable({
  providedIn: 'root',
})
export class SourceIngestionStore {
  private readonly source = signal<SourceFile | null>(null);
  private readonly job = signal<IngestionJob | null>(null);
  private readonly validation = signal<string>('');

  readonly selectedSource = this.source.asReadonly();
  readonly ingestionJob = this.job.asReadonly();
  readonly validationMessage = this.validation.asReadonly();

  selectSource(file: File): void {
    const sourceFile = SourceFile.create({name: file.name, size: file.size, type: file.type});
    this.source.set(sourceFile);
    this.validation.set('');
  }
}
