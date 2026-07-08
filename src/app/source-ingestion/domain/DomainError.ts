export class DomainError extends Error {
  private constructor(
    readonly type: 'notFound' | 'validation' | 'other',
    message: string,
  ) {
    super(message);
  }

  static createNotFound(message: string): DomainError {
    return new DomainError('notFound', message);
  }

  static createValidation(message: string): DomainError {
    return new DomainError('validation', message);
  }

  static create(message: string): DomainError {
    return new DomainError('other', message);
  }
}
