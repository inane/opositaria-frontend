import { TokenStorage } from '../../application/TokenStorage';

const STORAGE_KEY = 'opositaria_token';

export class LocalStorageTokenAdapter implements TokenStorage {
  save(token: string): void {
    localStorage.setItem(STORAGE_KEY, token);
  }

  read(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}