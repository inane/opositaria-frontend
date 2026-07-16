import { describe, it, expect } from 'vitest';
import { SourceFile } from './SourceFile';

describe('The SourceFile', () => {
  it('accepts a PDF file metadata', () => {
    const file = { name: 'exam.pdf', size: 1024, type: 'application/pdf' };

    const sourceFile = SourceFile.create(file);

    expect(sourceFile.name).toBe('exam.pdf');
    expect(sourceFile.type).toBe('application/pdf');
  });

  it('preserves the selected PDF file content', () => {
    const file = new File(['real pdf bytes'], 'exam.pdf', { type: 'application/pdf' });

    const sourceFile = SourceFile.create(file);

    expect(sourceFile.content).toBe(file);
    expect(sourceFile.content.size).toBe(file.size);
  });

  it('rejects a non-PDF file metadata', () => {
    const file = { name: 'exam.txt', size: 1024, type: 'text/plain' };

    expect(() => SourceFile.create(file)).toThrow('Only PDF files are supported');
  });
});
