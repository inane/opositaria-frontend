import { DomainError } from '../DomainError';

export type StudySpaceDocumentStatus = 'pending' | 'processing' | 'ready' | 'error';

export interface StudySpaceDocumentParams {
  id?: string;
  filename: string;
  status: StudySpaceDocumentStatus;
  chunksCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class StudySpaceDocument {
  private constructor(
    readonly id: string,
    readonly filename: string,
    readonly status: StudySpaceDocumentStatus,
    readonly chunksCount: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(params: StudySpaceDocumentParams): StudySpaceDocument {
    if (params.chunksCount < 0) {
      throw DomainError.createValidation('Document chunk count must not be negative');
    }

    return new StudySpaceDocument(
      params.id ?? crypto.randomUUID(),
      params.filename,
      params.status,
      params.chunksCount,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
    );
  }

  get isProcessing(): boolean {
    return this.status === 'pending' || this.status === 'processing';
  }

  get isReady(): boolean {
    return this.status === 'ready';
  }
}
