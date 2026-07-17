import { StudySpaceDocumentsStore } from './study-space-documents-store.service';
import { InMemoryStudySpaceDocumentRepository } from '../../domain/repositories/StudySpaceDocumentRepository';
import { ListStudySpaceDocumentsUseCase } from '../../application/ListStudySpaceDocumentsUseCase';
import { AddDocumentToStudySpaceUseCase } from '../../application/AddDocumentToStudySpaceUseCase';
import { DeleteStudySpaceDocumentUseCase } from '../../application/DeleteStudySpaceDocumentUseCase';
import { StudySpaceDocument } from '../../domain/entities/StudySpaceDocument';

describe('The StudySpaceDocumentsStore', () => {
  function createStore(
    documents: StudySpaceDocument[] = [],
    spaceDocuments?: Map<string, string[]>,
  ) {
    const repository = new InMemoryStudySpaceDocumentRepository(documents, spaceDocuments);
    const listUseCase = new ListStudySpaceDocumentsUseCase(repository);
    const addUseCase = new AddDocumentToStudySpaceUseCase(repository);
    const deleteUseCase = new DeleteStudySpaceDocumentUseCase(repository);
    return {
      store: new StudySpaceDocumentsStore(listUseCase, addUseCase, deleteUseCase),
      repository,
    };
  }

  it('loads documents and derives hasProcessingDocuments', async () => {
    const doc = StudySpaceDocument.create({
      id: 'doc-1',
      filename: 'notes.pdf',
      status: 'processing',
      chunksCount: 0,
    });

    const spaceDocs = new Map([['space-1', ['doc-1']]]);
    const { store } = createStore([doc], spaceDocs);

    await store.load('space-1');

    expect(store.isLoaded()).toBe(true);
    expect(store.documents()).toHaveLength(1);
    expect(store.hasProcessingDocuments()).toBe(true);
    expect(store.copilotAvailability()).toBe('processing');
  });

  it('refreshes documents after successful add', async () => {
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

    const spaceDocs = new Map([['space-1', ['doc-1']]]);
    const { store, repository } = createStore([doc1, doc2], spaceDocs);

    await store.load('space-1');
    expect(store.documents()).toHaveLength(1);

    await repository.addDocument('space-1', 'doc-2');
    await store.load('space-1');
    expect(store.documents()).toHaveLength(2);
  });

  it('preserves current document list when add association fails', async () => {
    const doc = StudySpaceDocument.create({
      id: 'doc-1',
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    const spaceDocs = new Map([['space-1', ['doc-1']]]);
    const { store } = createStore([doc], spaceDocs);
    await store.load('space-1');

    await expect(store.addDocument('space-1', 'doc-missing')).rejects.toThrow();
    expect(store.documents()).toHaveLength(1);
  });

  it('tracks pending document deletion', async () => {
    const doc = StudySpaceDocument.create({
      id: 'doc-1',
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    const spaceDocs = new Map([['space-1', ['doc-1']]]);
    const { store } = createStore([doc], spaceDocs);
    await store.load('space-1');

    store.requestDelete(doc);
    expect(store.pendingDelete()?.id).toBe('doc-1');
  });

  it('cancels pending deletion', async () => {
    const doc = StudySpaceDocument.create({
      id: 'doc-1',
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    const spaceDocs = new Map([['space-1', ['doc-1']]]);
    const { store } = createStore([doc], spaceDocs);
    await store.load('space-1');

    store.requestDelete(doc);
    store.cancelDelete();
    expect(store.pendingDelete()).toBeNull();
  });

  it('refreshes documents after confirmed delete', async () => {
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
    const { store } = createStore([doc1, doc2], spaceDocs);

    await store.load('space-1');
    expect(store.documents()).toHaveLength(2);

    store.requestDelete(doc1);
    await store.confirmDelete('space-1');

    expect(store.pendingDelete()).toBeNull();
    expect(store.documents()).toHaveLength(1);
    expect(store.documents()[0].id).toBe('doc-2');
  });

  it('updates empty state after last document deletion', async () => {
    const doc = StudySpaceDocument.create({
      id: 'doc-1',
      filename: 'notes.pdf',
      status: 'ready',
      chunksCount: 5,
    });

    const spaceDocs = new Map([['space-1', ['doc-1']]]);
    const { store } = createStore([doc], spaceDocs);

    await store.load('space-1');
    expect(store.copilotAvailability()).toBe('available');

    store.requestDelete(doc);
    await store.confirmDelete('space-1');

    expect(store.documents()).toHaveLength(0);
    expect(store.copilotAvailability()).toBe('empty');
    expect(store.hasProcessingDocuments()).toBe(false);
  });
});
