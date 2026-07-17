import { StudySpaceDocument } from '../entities/StudySpaceDocument';
import { DomainError } from '../DomainError';

export interface StudySpaceDocumentRepository {
  listBySpace(spaceId: string): Promise<StudySpaceDocument[]>;
  addDocument(spaceId: string, documentId: string): Promise<void>;
  deleteDocument(spaceId: string, documentId: string): Promise<void>;
}

export class InMemoryStudySpaceDocumentRepository implements StudySpaceDocumentRepository {
  private readonly documents: Map<string, StudySpaceDocument[]>;
  private readonly allDocuments: Map<string, StudySpaceDocument>;

  constructor(documents: StudySpaceDocument[] = [], spaceDocuments?: Map<string, string[]>) {
    this.allDocuments = new Map(documents.map((d) => [d.id, d]));
    this.documents = new Map();

    if (spaceDocuments) {
      for (const [spaceId, docIds] of spaceDocuments) {
        this.documents.set(
          spaceId,
          docIds
            .map((id) => this.allDocuments.get(id))
            .filter((d): d is StudySpaceDocument => d !== undefined),
        );
      }
    }
  }

  async listBySpace(spaceId: string): Promise<StudySpaceDocument[]> {
    return [...(this.documents.get(spaceId) ?? [])];
  }

  async addDocument(spaceId: string, documentId: string): Promise<void> {
    const doc = this.allDocuments.get(documentId);
    if (!doc) {
      throw DomainError.createNotFound(`Document ${documentId} not found`);
    }
    const existing = this.documents.get(spaceId) ?? [];
    this.documents.set(spaceId, [...existing, doc]);
  }

  async deleteDocument(spaceId: string, documentId: string): Promise<void> {
    const existing = this.documents.get(spaceId) ?? [];
    this.documents.set(
      spaceId,
      existing.filter((d) => d.id !== documentId),
    );
  }
}
