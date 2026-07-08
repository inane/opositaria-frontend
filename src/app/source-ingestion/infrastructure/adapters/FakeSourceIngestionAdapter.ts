import {SourceIngestionGateway} from '../../application/ports/SourceIngestionGateway';
import {SourceFile} from '../../domain/value-objects/SourceFile';
import {IngestionJob} from '../../domain/entities/IngestionJob';

export class FakeSourceIngestionAdapter implements SourceIngestionGateway {
  private jobs: Map<string, IngestionJob> = new Map();
  private nextId = 1;

  async start(sourceFile: SourceFile): Promise<IngestionJob> {
    const job = IngestionJob.create(`fake-job-${this.nextId++}`);
    this.jobs.set(job.jobId, job);

    return job;
  }

  async status(jobId: string): Promise<IngestionJob> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    return job;
  }
}
