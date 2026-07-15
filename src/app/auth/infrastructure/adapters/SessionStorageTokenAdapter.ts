import { TokenStorage } from '../../application/TokenStorage';

const STORAGE_KEY = 'opositaria_token';

export class SessionStorageTokenAdapter implements TokenStorage {
  save(token: string): void {
    sessionStorage.setItem(STORAGE_KEY, token);
  }

  read(): string | null {
    return sessionStorage.getItem(STORAGE_KEY);
  }

  clear(): void {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}