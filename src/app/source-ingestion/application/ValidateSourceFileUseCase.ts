import { SourceFile } from '../domain/value-objects/SourceFile';

export class ValidateSourceFileUseCase {
  execute(file: { name: string; size: number; type: string }): SourceFile {
    return SourceFile.create(file);
  }
}
