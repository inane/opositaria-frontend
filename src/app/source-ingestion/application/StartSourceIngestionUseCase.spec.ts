import { describe, it, expect } from 'vitest';
import { StartSourceIngestionUseCase } from './StartSourceIngestionUseCase';
import { InMemorySourceIngestionRepository } from '../domain/repositories/SourceIngestionRepository';
import { SourceFile } from '../domain/value-objects/SourceFile';
import { IngestionStatus } from '../domain/value-objects/IngestionStatus';

describe('The StartSourceIngestionUseCase', () => {
  it('starts ingestion for a valid PDF source', async () => {
    const repository = new InMemorySourceIngestionRepository();
    const sourceFile = SourceFile.create({
      name: 'exam.pdf',
      size: 1024,
      type: 'application/pdf',
    });
    const useCase = new StartSourceIngestionUseCase(repository);

    const job = await useCase.execute(sourceFile);

    expect(job.status).toBe(IngestionStatus.PENDING);
  });
});
