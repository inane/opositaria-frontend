import { DeleteStudySpaceDocumentUseCase } from './DeleteStudySpaceDocumentUseCase';
import { InMemoryStudySpaceDocumentRepository } from '../domain/repositories/StudySpaceDocumentRepository';
import { StudySpaceDocument } from '../domain/entities/StudySpaceDocument';

describe('The DeleteStudySpaceDocumentUseCase', () => {
  it('deletes one document from a study space', async () => {
    const doc = StudySpaceDocument.create({
      id: 'doc-1',
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    const spaceDocs = new Map([['space-1', ['doc-1']]]);
    const repository = new InMemoryStudySpaceDocumentRepository([doc], spaceDocs);
    const useCase = new DeleteStudySpaceDocumentUseCase(repository);

    await useCase.execute('space-1', 'doc-1');

    const docs = await repository.listBySpace('space-1');
    expect(docs).toHaveLength(0);
  });

  it('preserves other documents when deleting one', async () => {
    const doc1 = StudySpaceDocument.create({
      id: 'doc-1',
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    const doc2 = StudySpaceDocument.create({
      id: 'doc-2',
      filename: 'slides.pdf',
      status: 'ready',
      chunksCount: 3,
    });

    const spaceDocs = new Map([['space-1', ['doc-1', 'doc-2']]]);
    const repository = new InMemoryStudySpaceDocumentRepository([doc1, doc2], spaceDocs);
    const useCase = new DeleteStudySpaceDocumentUseCase(repository);

    await useCase.execute('space-1', 'doc-1');

    const docs = await repository.listBySpace('space-1');
    expect(docs).toHaveLength(1);
    expect(docs[0].id).toBe('doc-2');
  });

  it('allows deletion of the last document without deleting the space', async () => {
    const doc = StudySpaceDocument.create({
      id: 'doc-last',
      filename: 'final.pdf',
      status: 'ready',
      chunksCount: 10,
    });

    const spaceDocs = new Map([['space-1', ['doc-last']]]);
    const repository = new InMemoryStudySpaceDocumentRepository([doc], spaceDocs);
    const useCase = new DeleteStudySpaceDocumentUseCase(repository);

    await useCase.execute('space-1', 'doc-last');

    const docs = await repository.listBySpace('space-1');
    expect(docs).toHaveLength(0);
  });
});
