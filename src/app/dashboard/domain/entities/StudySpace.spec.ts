import { describe, expect, it } from 'vitest';
import { StudySpace } from './StudySpace';

describe('The StudySpace', () => {
  it('creates a study space with title, ownership, featured flag, source count, and display metadata', () => {
    const space = StudySpace.create({
      title: 'Algebraic Structures',
      isOwned: true,
      isFeatured: false,
      sourceCount: 3,
    });

    expect(space.title).toBe('Algebraic Structures');
    expect(space.isOwned).toBe(true);
    expect(space.isFeatured).toBe(false);
    expect(space.sourceCount).toBe(3);
    expect(space.id).toBeTruthy();
    expect(space.createdAt).toBeInstanceOf(Date);
    expect(space.sourceCountLabel).toBe('3 sources');
  });
});