export class SourceFile {
  private constructor(
    readonly name: string,
    readonly size: number,
    readonly type: string,
  ) {}

  static create(file: {name: string; size: number; type: string}): SourceFile {
    return new SourceFile(file.name, file.size, file.type);
  }
}
