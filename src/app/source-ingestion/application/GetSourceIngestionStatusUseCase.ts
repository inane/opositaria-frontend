import {SourceIngestionGateway} from './ports/SourceIngestionGateway';
import {IngestionJob} from '../domain/entities/IngestionJob';

export class GetSourceIngestionStatusUseCase {
  constructor(private readonly gateway: SourceIngestionGateway) {}

  execute(jobId: string): Promise<IngestionJob> {
    return this.gateway.status(jobId);
  }
}
