import { ListStudySpaceDocumentsUseCase } from './ListStudySpaceDocumentsUseCase';
import { InMemoryStudySpaceDocumentRepository } from '../domain/repositories/StudySpaceDocumentRepository';
import { StudySpaceDocument } from '../domain/entities/StudySpaceDocument';

describe('The ListStudySpaceDocumentsUseCase', () => {
  it('lists documents of an owned study space', async () => {
    const doc1 = StudySpaceDocument.create({
      id: 'doc-1',
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    const doc2 = StudySpaceDocument.create({
      id: 'doc-2',
      filename: 'slides.pdf',
      status: 'processing',
      chunksCount: 0,
    });

    const spaceDocs = new Map([['space-1', ['doc-1', 'doc-2']]]);
    const repository = new InMemoryStudySpaceDocumentRepository([doc1, doc2], spaceDocs);
    const useCase = new ListStudySpaceDocumentsUseCase(repository);

    const result = await useCase.execute('space-1');

    expect(result).toHaveLength(2);
    expect(result[0].filename).toBe('notes.pdf');
    expect(result[1].filename).toBe('slides.pdf');
  });

  it('returns an empty list for an owned empty space', async () => {
    const repository = new InMemoryStudySpaceDocumentRepository([]);
    const useCase = new ListStudySpaceDocumentsUseCase(repository);

    const result = await useCase.execute('empty-space');

    expect(result).toHaveLength(0);
  });
});
