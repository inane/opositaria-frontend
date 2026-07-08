import { DomainError } from '../DomainError';

export class SourceFile {
  private constructor(
    readonly name: string,
    readonly size: number,
    readonly type: string,
  ) {}

  static create(file: { name: string; size: number; type: string }): SourceFile {
    if (file.type !== 'application/pdf') {
      throw DomainError.createValidation('Only PDF files are supported');
    }

    return new SourceFile(file.name, file.size, file.type);
  }
}
