import { describe, expect, it } from 'vitest';
import { LoginCredentials } from './LoginCredentials';
import { AuthError } from './AuthError';
/*
 * TDD Case List — Auth domain entities
 * ======================================
 *
 * LoginCredentials
 * 1. Creates credentials from USUARIO and PASSWORD values
 *    → email maps to usuario value, password maps to password value
 *
 * 2. Rejects empty USUARIO
 *    → empty string → AuthError
 *
 * 3. Rejects whitespace-only USUARIO
 *    → spaces only → AuthError
 *
 * 4. Rejects empty PASSWORD
 *    → empty string → AuthError
 */

describe('The LoginCredentials', () => {
  it('creates credentials from USUARIO and PASSWORD values', () => {
    const credentials = LoginCredentials.create({
      email: 'user@example.com',
      password: 'secret123',
    });

    expect(credentials.email).toBe('user@example.com');
    expect(credentials.password).toBe('secret123');
  });

  it('rejects an empty USUARIO value', () => {
    expect(() =>
      LoginCredentials.create({
        email: '',
        password: 'secret123',
      }),
    ).toThrow(AuthError);
  });

  it('rejects an empty PASSWORD value', () => {
    expect(() =>
      LoginCredentials.create({
        email: 'user@example.com',
        password: '',
      }),
    ).toThrow(AuthError);
  });
});