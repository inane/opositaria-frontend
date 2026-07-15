import { DomainError } from './DomainError';

export interface StudySpaceCreationParams {
  title: string;
  isOwned: boolean;
  isFeatured: boolean;
  sourceCount: number;
}

export class StudySpace {
  private constructor(
    readonly id: string,
    readonly title: string,
    readonly isOwned: boolean,
    readonly isFeatured: boolean,
    readonly sourceCount: number,
    readonly createdAt: Date,
  ) {}

  static create(params: StudySpaceCreationParams): StudySpace {
    if (params.title.trim().length === 0) {
      throw DomainError.createValidation('Study space title must not be empty');
    }

    if (params.sourceCount < 0) {
      throw DomainError.createValidation('Study space source count must not be negative');
    }

    return new StudySpace(
      crypto.randomUUID(),
      params.title,
      params.isOwned,
      params.isFeatured,
      params.sourceCount,
      new Date(),
    );
  }

  get sourceCountLabel(): string {
    return this.sourceCount === 1 ? '1 source' : `${this.sourceCount} sources`;
  }

  matches(searchTerm: string): boolean {
    return this.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}