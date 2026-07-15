import { StudySpace } from '../entities/StudySpace';

export interface StudySpaceRepository {
  listAll(): Promise<StudySpace[]>;
}

export class InMemoryStudySpaceRepository implements StudySpaceRepository {
  private readonly spaces: StudySpace[];

  constructor(spaces: StudySpace[] = []) {
    this.spaces = [...spaces];
  }

  async listAll(): Promise<StudySpace[]> {
    return [...this.spaces];
  }
}