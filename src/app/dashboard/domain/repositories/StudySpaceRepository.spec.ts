import { describe, expect, it } from 'vitest';
import { InMemoryStudySpaceRepository } from './StudySpaceRepository';
import { StudySpace } from '../entities/StudySpace';

describe('The StudySpaceRepository', () => {
  it('lists all seeded study spaces', async () => {
    const space1 = StudySpace.create({
      title: 'Algebraic Structures',
      isOwned: true,
      isFeatured: false,
      sourceCount: 3,
    });
    const space2 = StudySpace.create({
      title: 'Calculus Basics',
      isOwned: false,
      isFeatured: true,
      sourceCount: 5,
    });
    const repository = new InMemoryStudySpaceRepository([space1, space2]);

    const spaces = await repository.listAll();

    expect(spaces).toHaveLength(2);
    expect(spaces).toContain(space1);
    expect(spaces).toContain(space2);
  });
});