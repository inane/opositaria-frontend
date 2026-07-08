import { describe, it, expect } from 'vitest';
import { ValidateSourceFileUseCase } from './ValidateSourceFileUseCase';
import { DomainError } from '../domain/DomainError';

describe('The ValidateSourceFileUseCase', () => {
  it('accepts a valid PDF file', () => {
    const useCase = new ValidateSourceFileUseCase();

    const sourceFile = useCase.execute({
      name: 'exam.pdf',
      size: 1024,
      type: 'application/pdf',
    });

    expect(sourceFile.name).toBe('exam.pdf');
    expect(sourceFile.type).toBe('application/pdf');
  });

  it('rejects a non-PDF file with a validation error', () => {
    const useCase = new ValidateSourceFileUseCase();

    expect(() => useCase.execute({ name: 'exam.txt', size: 1024, type: 'text/plain' })).toThrow(
      DomainError,
    );
  });
});
