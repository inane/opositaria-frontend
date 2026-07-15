import { TokenPersistence, TokenStorage } from '../../application/TokenStorage';

const STORAGE_KEY = 'opositaria_token';

export class TokenStorageService implements TokenStorage {
  save(token: string, persistence: TokenPersistence = 'session'): void {
    this.clear();

    if (persistence === 'persistent') {
      localStorage.setItem(STORAGE_KEY, token);
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, token);
  }

  read(): string | null {
    return localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
