import { StudySpaceDetail } from '../entities/StudySpaceDetail';
import { DomainError } from '../DomainError';

export interface StudySpaceDetailRepository {
  getById(spaceId: string): Promise<StudySpaceDetail>;
}

export class InMemoryStudySpaceDetailRepository implements StudySpaceDetailRepository {
  private readonly spaces: Map<string, StudySpaceDetail>;

  constructor(spaces: StudySpaceDetail[] = []) {
    this.spaces = new Map(spaces.map((s) => [s.id, s]));
  }

  async getById(spaceId: string): Promise<StudySpaceDetail> {
    const space = this.spaces.get(spaceId);
    if (!space) {
      throw DomainError.createNotFound(`Study space ${spaceId} not found`);
    }
    return space;
  }
}
