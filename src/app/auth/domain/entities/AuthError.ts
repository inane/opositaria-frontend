export class AuthError extends Error {
  private constructor(
    readonly type: 'validation' | 'unauthorized' | 'unknown',
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }

  static createValidation(message: string): AuthError {
    return new AuthError('validation', message);
  }

  static createUnauthorized(message: string): AuthError {
    return new AuthError('unauthorized', message);
  }

  static create(message: string): AuthError {
    return new AuthError('unknown', message);
  }
}