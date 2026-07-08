import { InjectionToken } from '@angular/core';
import { SourceIngestionRepository } from '../../domain/repositories/SourceIngestionRepository';

export const SOURCE_INGESTION_PORT = new InjectionToken<SourceIngestionRepository>(
  'SOURCE_INGESTION_PORT',
);
