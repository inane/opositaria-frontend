import { describe, it, expect } from 'vitest';
import { GetSourceIngestionStatusUseCase } from './GetSourceIngestionStatusUseCase';
import { InMemorySourceIngestionRepository } from '../domain/repositories/SourceIngestionRepository';
import { SourceFile } from '../domain/value-objects/SourceFile';
import { IngestionStatus } from '../domain/value-objects/IngestionStatus';

describe('The GetSourceIngestionStatusUseCase', () => {
  it('reports the current status of an ingestion job', async () => {
    const repository = new InMemorySourceIngestionRepository();
    const sourceFile = SourceFile.create({
      name: 'exam.pdf',
      size: 1024,
      type: 'application/pdf',
    });
    const useCase = new GetSourceIngestionStatusUseCase(repository);
    const startedJob = await repository.start(sourceFile);

    const job = await useCase.execute(startedJob.jobId);

    expect(job.status).toBe(IngestionStatus.PROCESSING);
  });
});
