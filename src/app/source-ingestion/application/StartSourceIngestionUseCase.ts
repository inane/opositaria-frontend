import {Injectable, Inject} from '@angular/core';
import {SOURCE_INGESTION_GATEWAY, SourceIngestionGateway} from './ports/SourceIngestionGateway';
import {SourceFile} from '../domain/value-objects/SourceFile';
import {IngestionJob} from '../domain/entities/IngestionJob';

export interface StartSourceIngestionRequest {
  name: string;
  size: number;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class StartSourceIngestionUseCase {
  constructor(@Inject(SOURCE_INGESTION_GATEWAY) private readonly gateway: SourceIngestionGateway) {}

  execute(request: StartSourceIngestionRequest): Promise<IngestionJob> {
    try {
      const sourceFile = SourceFile.create(request);

      return this.gateway.start(sourceFile);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
