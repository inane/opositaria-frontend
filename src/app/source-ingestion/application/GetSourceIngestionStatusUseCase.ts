import {Injectable, Inject} from '@angular/core';
import {SOURCE_INGESTION_GATEWAY, SourceIngestionGateway} from './ports/SourceIngestionGateway';
import {IngestionJob} from '../domain/entities/IngestionJob';

@Injectable({
  providedIn: 'root',
})
export class GetSourceIngestionStatusUseCase {
  constructor(@Inject(SOURCE_INGESTION_GATEWAY) private readonly gateway: SourceIngestionGateway) {}

  execute(jobId: string): Promise<IngestionJob> {
    return this.gateway.status(jobId);
  }
}
