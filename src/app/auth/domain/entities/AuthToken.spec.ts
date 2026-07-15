import { describe, expect, it } from 'vitest';
import { AuthToken } from './AuthToken';
import { AuthError } from './AuthError';

describe('The AuthToken', () => {
  it('creates a token from backend access_token and token_type bearer', () => {
    const token = AuthToken.create({ accessToken: 'abc123', tokenType: 'bearer' });

    expect(token.accessToken).toBe('abc123');
    expect(token.tokenType).toBe('bearer');
  });

  it('rejects an unsupported token type', () => {
    expect(() => AuthToken.create({ accessToken: 'abc123', tokenType: 'Basic' })).toThrow(AuthError);
  });

  it('rejects an empty access token', () => {
    expect(() => AuthToken.create({ accessToken: ' ', tokenType: 'bearer' })).toThrow(AuthError);
  });

  it('exposes a Bearer authorization header value', () => {
    const token = AuthToken.create({ accessToken: 'abc123', tokenType: 'bearer' });

    expect(token.createAuthorizationValue()).toBe('Bearer abc123');
  });
});
