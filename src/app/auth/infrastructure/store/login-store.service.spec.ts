import { describe, expect, it, beforeEach } from 'vitest';
import { LoginStore } from './login-store.service';
import { InMemoryAuthRepository } from '../../domain/repositories/AuthRepository';
import { InMemoryTokenStorage } from '../../application/TokenStorage';
import { LoginUseCase } from '../../application/LoginUseCase';

describe('The LoginStore', () => {
  let store: LoginStore;

  beforeEach(() => {
    const repository = new InMemoryAuthRepository([{ email: 'user@example.com', password: 'secret123' }]);
    const storage = new InMemoryTokenStorage();
    const useCase = new LoginUseCase(repository, storage);
    store = new LoginStore(useCase);
  });

  it('starts with empty fields and no error', () => {
    expect(store.email()).toBe('');
    expect(store.password()).toBe('');
    expect(store.remember()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.isLoading()).toBe(false);
  });

  it('updates the email and password fields', () => {
    store.setEmail('user@example.com');
    store.setPassword('secret123');

    expect(store.email()).toBe('user@example.com');
    expect(store.password()).toBe('secret123');
  });

  it('toggles the remember password state', () => {
    expect(store.remember()).toBe(false);
    store.toggleRemember();
    expect(store.remember()).toBe(true);
    store.toggleRemember();
    expect(store.remember()).toBe(false);
  });

  it('sets the remember password state from the checkbox value', () => {
    store.setRemember(true);
    expect(store.remember()).toBe(true);

    store.setRemember(false);
    expect(store.remember()).toBe(false);
  });

  it('exposes a login error when credentials are invalid', async () => {
    store.setEmail('wrong@example.com');
    store.setPassword('wrongpassword');

    const didLogin = await store.login();

    expect(didLogin).toBe(false);
    expect(store.error()).toBe('Invalid credentials');
    expect(store.isLoading()).toBe(false);
  });

  it('clears the error when a field is updated after a failed login', async () => {
    store.setEmail('wrong@example.com');
    store.setPassword('wrongpassword');
    await store.login();
    expect(store.error()).toBe('Invalid credentials');

    store.setEmail('user@example.com');

    expect(store.error()).toBeNull();
  });
});
