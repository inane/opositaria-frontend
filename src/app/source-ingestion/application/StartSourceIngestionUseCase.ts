import { SourceIngestionRepository } from '../domain/repositories/SourceIngestionRepository';
import { SourceFile } from '../domain/value-objects/SourceFile';
import { IngestionJob } from '../domain/entities/IngestionJob';

export class StartSourceIngestionUseCase {
  constructor(private readonly repository: SourceIngestionRepository) {}

  execute(sourceFile: SourceFile): Promise<IngestionJob> {
    return this.repository.start(sourceFile);
  }
}
