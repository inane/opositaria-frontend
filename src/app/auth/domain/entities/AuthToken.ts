import { AuthError } from './AuthError';

export interface AuthTokenParams {
  accessToken: string;
  tokenType: string;
}

export class AuthToken {
  private constructor(
    readonly accessToken: string,
    readonly tokenType: string,
  ) {}

  static create(params: AuthTokenParams): AuthToken {
    if (params.accessToken.trim().length === 0) {
      throw AuthError.createValidation('Access token must not be empty');
    }

    if (params.tokenType.toLowerCase() !== 'bearer') {
      throw AuthError.createValidation('Only bearer token type is supported');
    }

    return new AuthToken(params.accessToken, params.tokenType);
  }

  createAuthorizationValue(): string {
    return `Bearer ${this.accessToken}`;
  }
}
