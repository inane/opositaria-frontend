export interface StudySpaceCreationParams {
  title: string;
  isOwned: boolean;
  isFeatured: boolean;
  sourceCount: number;
}

export class StudySpace {
  private constructor(
    readonly id: string,
    readonly title: string,
    readonly isOwned: boolean,
    readonly isFeatured: boolean,
    readonly sourceCount: number,
    readonly createdAt: Date,
  ) {}

  static create(params: StudySpaceCreationParams): StudySpace {
    return new StudySpace(
      crypto.randomUUID(),
      params.title,
      params.isOwned,
      params.isFeatured,
      params.sourceCount,
      new Date(),
    );
  }

  get sourceCountLabel(): string {
    return this.sourceCount === 1 ? '1 source' : `${this.sourceCount} sources`;
  }
}