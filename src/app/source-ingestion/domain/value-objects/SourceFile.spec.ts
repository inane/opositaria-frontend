import {describe, it, expect} from 'vitest';
import {SourceFile} from './SourceFile';

describe('The SourceFile', () => {
  it('accepts a PDF file metadata', () => {
    const file = {name: 'exam.pdf', size: 1024, type: 'application/pdf'};

    const sourceFile = SourceFile.create(file);

    expect(sourceFile.name).toBe('exam.pdf');
    expect(sourceFile.type).toBe('application/pdf');
  });
});
