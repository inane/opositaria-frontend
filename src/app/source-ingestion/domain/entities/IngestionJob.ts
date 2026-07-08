import {IngestionStatus} from '../value-objects/IngestionStatus';

export class IngestionJob {
  private constructor(
    readonly jobId: string,
    readonly status: IngestionStatus,
  ) {}

  static create(jobId: string): IngestionJob {
    return new IngestionJob(jobId, IngestionStatus.PENDING);
  }

  startProcessing(): IngestionJob {
    return new IngestionJob(this.jobId, IngestionStatus.PROCESSING);
  }
}
