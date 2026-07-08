import { SourceFile } from '../value-objects/SourceFile';
import { IngestionJob } from '../entities/IngestionJob';
import { IngestionStatus } from '../value-objects/IngestionStatus';
import { DomainError } from '../DomainError';

export interface SourceIngestionRepository {
  start(sourceFile: SourceFile): Promise<IngestionJob>;

  status(jobId: string): Promise<IngestionJob>;
}

export class InMemorySourceIngestionRepository implements SourceIngestionRepository {
  private jobs = new Map<string, IngestionJob>();
  private sourceNames = new Map<string, string>();
  private nextId = 1;

  async start(sourceFile: SourceFile): Promise<IngestionJob> {
    const job = IngestionJob.create(`fake-job-${this.nextId++}`);
    this.jobs.set(job.jobId, job);
    this.sourceNames.set(job.jobId, sourceFile.name);

    return job;
  }

  async status(jobId: string): Promise<IngestionJob> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw DomainError.createNotFound(`Job ${jobId} not found`);
    }

    if (job.status === IngestionStatus.PENDING) {
      const processingJob = job.startProcessing();
      this.jobs.set(jobId, processingJob);

      return processingJob;
    }

    if (job.status === IngestionStatus.PROCESSING) {
      const sourceName = this.sourceNames.get(jobId) ?? '';
      const nextJob = sourceName.includes('error')
        ? job.fail('Ingestion failed. Please try again.')
        : job.complete();
      this.jobs.set(jobId, nextJob);

      return nextJob;
    }

    return job;
  }
}
