export type TokenPersistence = 'persistent' | 'session';

export interface TokenStorage {
  save(token: string, persistence?: TokenPersistence): void;
  read(): string | null;
  clear(): void;
}

export class InMemoryTokenStorage implements TokenStorage {
  private storage: string | null = null;

  save(token: string): void {
    this.storage = token;
  }

  read(): string | null {
    return this.storage;
  }

  clear(): void {
    this.storage = null;
  }
}
