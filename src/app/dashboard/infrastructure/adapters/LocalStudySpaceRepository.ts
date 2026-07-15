import { StudySpace } from '../../domain/entities/StudySpace';
import { StudySpaceRepository } from '../../domain/repositories/StudySpaceRepository';

export class LocalStudySpaceRepository implements StudySpaceRepository {
  private readonly spaces: StudySpace[];

  constructor(spaces: StudySpace[] = []) {
    this.spaces = [...spaces];
  }

  async listAll(): Promise<StudySpace[]> {
    return [...this.spaces];
  }

  async save(space: StudySpace): Promise<void> {
    this.spaces.push(space);
  }
}
