import { DomainError } from '../DomainError';

export interface StudySpaceDetailParams {
  id?: string;
  title: string;
  documentCount: number;
  createdAt?: Date;
}

export class StudySpaceDetail {
  private constructor(
    readonly id: string,
    readonly title: string,
    readonly documentCount: number,
    readonly createdAt: Date,
  ) {}

  static create(params: StudySpaceDetailParams): StudySpaceDetail {
    if (params.title.trim().length === 0) {
      throw DomainError.createValidation('Study space title must not be empty');
    }

    return new StudySpaceDetail(
      params.id ?? crypto.randomUUID(),
      params.title,
      params.documentCount,
      params.createdAt ?? new Date(),
    );
  }
}
