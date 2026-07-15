import { describe, expect, it } from 'vitest';
import { LoginUseCase } from './LoginUseCase';
import { InMemoryAuthRepository } from '../domain/repositories/AuthRepository';
import { InMemoryTokenStorage, TokenPersistence, TokenStorage } from './TokenStorage';

class CapturingTokenStorage implements TokenStorage {
  token: string | null = null;
  persistence: TokenPersistence | undefined;

  save(token: string, persistence?: TokenPersistence): void {
    this.token = token;
    this.persistence = persistence;
  }

  read(): string | null {
    return this.token;
  }

  clear(): void {
    this.token = null;
    this.persistence = undefined;
  }
}

describe('The LoginUseCase', () => {
  it('logs in successfully with valid credentials and stores the token', async () => {
    const repository = new InMemoryAuthRepository([{ email: 'user@example.com', password: 'secret123' }]);
    const storage = new InMemoryTokenStorage();
    const useCase = new LoginUseCase(repository, storage);

    const result = await useCase.execute({
      email: 'user@example.com',
      password: 'secret123',
      remember: true,
    });

    expect(result.accessToken).toBeTruthy();
    expect(storage.read()).toBe(result.accessToken);
  });

  it('stores remembered logins persistently', async () => {
    const repository = new InMemoryAuthRepository([{ email: 'user@example.com', password: 'secret123' }]);
    const storage = new CapturingTokenStorage();
    const useCase = new LoginUseCase(repository, storage);

    await useCase.execute({ email: 'user@example.com', password: 'secret123', remember: true });

    expect(storage.persistence).toBe('persistent');
  });

  it('stores non-remembered logins for the session', async () => {
    const repository = new InMemoryAuthRepository([{ email: 'user@example.com', password: 'secret123' }]);
    const storage = new CapturingTokenStorage();
    const useCase = new LoginUseCase(repository, storage);

    await useCase.execute({ email: 'user@example.com', password: 'secret123', remember: false });

    expect(storage.persistence).toBe('session');
  });

  it('rejects invalid credentials', async () => {
    const repository = new InMemoryAuthRepository([{ email: 'user@example.com', password: 'secret123' }]);
    const storage = new InMemoryTokenStorage();
    const useCase = new LoginUseCase(repository, storage);

    await expect(
      useCase.execute({ email: 'user@example.com', password: 'wrongpassword', remember: false }),
    ).rejects.toThrow();
  });

  it('rejects empty USUARIO before calling the repository', async () => {
    const repository = new InMemoryAuthRepository([{ email: 'user@example.com', password: 'secret123' }]);
    const storage = new InMemoryTokenStorage();
    const useCase = new LoginUseCase(repository, storage);

    await expect(
      useCase.execute({ email: '   ', password: 'secret123', remember: false }),
    ).rejects.toThrow('USUARIO must not be empty');
  });

  it('rejects empty PASSWORD before calling the repository', async () => {
    const repository = new InMemoryAuthRepository([{ email: 'user@example.com', password: 'secret123' }]);
    const storage = new InMemoryTokenStorage();
    const useCase = new LoginUseCase(repository, storage);

    await expect(
      useCase.execute({ email: 'user@example.com', password: '', remember: false }),
    ).rejects.toThrow('PASSWORD must not be empty');
  });
});
