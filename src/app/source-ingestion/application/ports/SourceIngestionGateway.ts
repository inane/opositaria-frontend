import {InjectionToken} from '@angular/core';
import {SourceFile} from '../../domain/value-objects/SourceFile';
import {IngestionJob} from '../../domain/entities/IngestionJob';

export interface SourceIngestionGateway {
  start(sourceFile: SourceFile): Promise<IngestionJob>;

  status(jobId: string): Promise<IngestionJob>;
}

export const SOURCE_INGESTION_GATEWAY = new InjectionToken<SourceIngestionGateway>('SOURCE_INGESTION_GATEWAY');
