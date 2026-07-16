import { StudySpace } from '../entities/StudySpace';

export interface StudySpaceRepository {
  listAll(): Promise<StudySpace[]>;
  save(space: StudySpace): Promise<void>;
  createStudySpace?(name: string, documentIds: string[]): Promise<StudySpace>;
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

  async createStudySpace(name: string, _documentIds: string[]): Promise<StudySpace> {
    const space = StudySpace.create({
      title: name,
      isOwned: true,
      isFeatured: false,
      sourceCount: 1,
    });
    this.spaces.push(space);
    return space;
  }
}