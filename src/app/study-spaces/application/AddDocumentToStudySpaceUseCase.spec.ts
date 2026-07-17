import { AddDocumentToStudySpaceUseCase } from './AddDocumentToStudySpaceUseCase';
import { InMemoryStudySpaceDocumentRepository } from '../domain/repositories/StudySpaceDocumentRepository';
import { StudySpaceDocument } from '../domain/entities/StudySpaceDocument';
import { DomainError } from '../domain/DomainError';

describe('The AddDocumentToStudySpaceUseCase', () => {
  it('adds a ready document id to a study space', async () => {
    const doc = StudySpaceDocument.create({
      id: 'doc-123',
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    const repository = new InMemoryStudySpaceDocumentRepository([doc]);
    const useCase = new AddDocumentToStudySpaceUseCase(repository);

    await useCase.execute('space-1', 'doc-123');

    const docs = await repository.listBySpace('space-1');
    expect(docs).toHaveLength(1);
    expect(docs[0].id).toBe('doc-123');
  });

  it('throws when repository reports inaccessible space', async () => {
    const repository = new InMemoryStudySpaceDocumentRepository([]);
    const useCase = new AddDocumentToStudySpaceUseCase(repository);

    await expect(useCase.execute('missing-space', 'doc-123')).rejects.toMatchObject({
      type: 'notFound',
    });
  });
});
