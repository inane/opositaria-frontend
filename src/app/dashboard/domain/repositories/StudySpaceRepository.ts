import { StudySpace } from '../entities/StudySpace';

export interface StudySpaceRepository {
  listAll(): Promise<StudySpace[]>;
  save(space: StudySpace): Promise<void>;
}

export class InMemoryStudySpaceRepository implements StudySpaceRepository {
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