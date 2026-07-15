import { describe, expect, it } from 'vitest';
import { StudySpace } from './StudySpace';
import { DomainError } from './DomainError';

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

  it('rejects an empty title', () => {
    expect(() =>
      StudySpace.create({
        title: '',
        isOwned: true,
        isFeatured: false,
        sourceCount: 0,
      }),
    ).toThrow(DomainError);
  });

  it('rejects a negative source count', () => {
    expect(() =>
      StudySpace.create({
        title: 'Algebraic Structures',
        isOwned: true,
        isFeatured: false,
        sourceCount: -1,
      }),
    ).toThrow(DomainError);
  });

  it('matches title by a case-insensitive search term', () => {
    const space = StudySpace.create({
      title: 'Algebraic Structures',
      isOwned: true,
      isFeatured: false,
      sourceCount: 3,
    });

    expect(space.matches('algebraic')).toBe(true);
    expect(space.matches('ALGEBRAIC')).toBe(true);
    expect(space.matches('Algebraic')).toBe(true);
    expect(space.matches('Structures')).toBe(true);
    expect(space.matches('Geometry')).toBe(false);
  });

  it('identifies filter membership for all, owned, not owned, featured, and not featured', () => {
    const ownedSpace = StudySpace.create({
      title: 'My Space',
      isOwned: true,
      isFeatured: false,
      sourceCount: 2,
    });
    const featuredSpace = StudySpace.create({
      title: 'Featured Space',
      isOwned: false,
      isFeatured: true,
      sourceCount: 5,
    });
    const otherSpace = StudySpace.create({
      title: 'Other Space',
      isOwned: false,
      isFeatured: false,
      sourceCount: 0,
    });

    expect(StudySpace.matchesFilter(ownedSpace, 'all')).toBe(true);
    expect(StudySpace.matchesFilter(featuredSpace, 'all')).toBe(true);
    expect(StudySpace.matchesFilter(otherSpace, 'all')).toBe(true);

    expect(StudySpace.matchesFilter(ownedSpace, 'owned')).toBe(true);
    expect(StudySpace.matchesFilter(featuredSpace, 'owned')).toBe(false);
    expect(StudySpace.matchesFilter(otherSpace, 'owned')).toBe(false);

    expect(StudySpace.matchesFilter(ownedSpace, 'featured')).toBe(false);
    expect(StudySpace.matchesFilter(featuredSpace, 'featured')).toBe(true);
    expect(StudySpace.matchesFilter(otherSpace, 'featured')).toBe(false);
  });
});