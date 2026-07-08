import { describe, it, expect } from 'vitest';
import { DomainError } from './DomainError';

describe('The DomainError', () => {
  it('creates a not-found error', () => {
    const error = DomainError.createNotFound('Resource missing');

    expect(error.type).toBe('notFound');
    expect(error.message).toBe('Resource missing');
    expect(error.name).toBe('DomainError');
  });

  it('creates a validation error', () => {
    const error = DomainError.createValidation('Invalid value');

    expect(error.type).toBe('validation');
    expect(error.message).toBe('Invalid value');
  });

  it('creates a generic error', () => {
    const error = DomainError.create('Something went wrong');

    expect(error.type).toBe('other');
    expect(error.message).toBe('Something went wrong');
  });
});
