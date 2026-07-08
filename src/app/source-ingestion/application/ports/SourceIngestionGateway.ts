import {InjectionToken} from '@angular/core';
import {SourceFile} from '../../domain/value-objects/SourceFile';
import {IngestionJob} from '../../domain/entities/IngestionJob';

/**
 * Frontend-facing contract for source ingestion.
 *
 * Future FastAPI operations aligned with this contract:
 * - start -> POST /sources (multipart/form-data with the PDF file)
 * - status -> GET /sources/{jobId}/status
 */
export interface SourceIngestionGateway {
  start(sourceFile: SourceFile): Promise<IngestionJob>;

  status(jobId: string): Promise<IngestionJob>;
}

export const SOURCE_INGESTION_GATEWAY = new InjectionToken<SourceIngestionGateway>('SOURCE_INGESTION_GATEWAY');
