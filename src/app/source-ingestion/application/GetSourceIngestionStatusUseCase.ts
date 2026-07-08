import { SourceIngestionRepository } from '../domain/repositories/SourceIngestionRepository';
import { IngestionJob } from '../domain/entities/IngestionJob';

export class GetSourceIngestionStatusUseCase {
  constructor(private readonly repository: SourceIngestionRepository) {}

  execute(jobId: string): Promise<IngestionJob> {
    return this.repository.status(jobId);
  }
}
