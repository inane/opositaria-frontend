import { AuthToken } from '../entities/AuthToken';
import { AuthError } from '../entities/AuthError';

export interface AuthRepository {
  login(credentials: { email: string; password: string }): Promise<AuthToken>;
}

export class InMemoryAuthRepository implements AuthRepository {
  private readonly users: { email: string; password: string }[];

  constructor(users: { email: string; password: string }[] = []) {
    this.users = [...users];
  }

  async login(credentials: { email: string; password: string }): Promise<AuthToken> {
    const user = this.users.find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    );

    if (!user) {
      throw AuthError.createUnauthorized('Invalid credentials');
    }

    return AuthToken.create({ accessToken: 'fake-token', tokenType: 'bearer' });
  }
}