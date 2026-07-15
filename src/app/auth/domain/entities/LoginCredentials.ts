import { AuthError } from './AuthError';

export interface LoginCredentialsParams {
  email: string;
  password: string;
}

export class LoginCredentials {
  private constructor(
    readonly email: string,
    readonly password: string,
  ) {}

  static create(params: LoginCredentialsParams): LoginCredentials {
    if (params.email.trim().length === 0) {
      throw AuthError.createValidation('USUARIO must not be empty');
    }

    if (params.password.length === 0) {
      throw AuthError.createValidation('PASSWORD must not be empty');
    }

    return new LoginCredentials(params.email, params.password);
  }
}