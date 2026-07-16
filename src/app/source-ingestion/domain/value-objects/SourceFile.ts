import { DomainError } from '../DomainError';

export class SourceFile {
  private constructor(
    readonly name: string,
    readonly size: number,
    readonly type: string,
    readonly content: Blob,
  ) {}

  static create(file: { name: string; size: number; type: string }): SourceFile {
    if (file.type !== 'application/pdf') {
      throw DomainError.createValidation('Only PDF files are supported');
    }

    const content = file instanceof Blob ? file : new Blob([], { type: file.type });
    return new SourceFile(file.name, file.size, file.type, content);
  }
}
