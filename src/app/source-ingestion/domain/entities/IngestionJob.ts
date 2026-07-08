import {IngestionStatus} from '../value-objects/IngestionStatus';

export class IngestionJob {
  private constructor(
    readonly jobId: string,
    readonly status: IngestionStatus,
    readonly recoveryMessage: string = '',
  ) {}

  static create(jobId: string): IngestionJob {
    return new IngestionJob(jobId, IngestionStatus.PENDING);
  }

  startProcessing(): IngestionJob {
    return new IngestionJob(this.jobId, IngestionStatus.PROCESSING);
  }

  complete(): IngestionJob {
    return new IngestionJob(this.jobId, IngestionStatus.DONE);
  }

  fail(recoveryMessage: string): IngestionJob {
    return new IngestionJob(this.jobId, IngestionStatus.ERROR, recoveryMessage);
  }
}
