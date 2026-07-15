import { AuthRepository } from '../domain/repositories/AuthRepository';
import { LoginCredentials } from '../domain/entities/LoginCredentials';
import { TokenStorage } from './TokenStorage';

export interface LoginRequest {
  email: string;
  password: string;
  remember: boolean;
}

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly tokenStorage: TokenStorage,
  ) {}

  async execute(request: LoginRequest): Promise<{ accessToken: string }> {
    const credentials = LoginCredentials.create({ email: request.email, password: request.password });
    const token = await this.authRepository.login(credentials);
    this.tokenStorage.save(token.accessToken, request.remember ? 'persistent' : 'session');
    return { accessToken: token.accessToken };
  }
}
