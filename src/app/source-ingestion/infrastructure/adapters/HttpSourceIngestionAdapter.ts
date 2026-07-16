import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { SourceIngestionRepository } from '../../domain/repositories/SourceIngestionRepository';
import { SourceFile } from '../../domain/value-objects/SourceFile';
import { IngestionJob } from '../../domain/entities/IngestionJob';
import { IngestionStatus, fromBackendStatus } from '../../domain/value-objects/IngestionStatus';
import { DomainError } from '../../domain/DomainError';

interface UploadResponse {
  document_id: string;
  status: string;
}

interface StatusResponse {
  document_id: string;
  filename: string;
  status: string;
  failure_reason: string | null;
  chunks_count: number;
}

@Injectable({ providedIn: 'root' })
export class HttpSourceIngestionAdapter implements SourceIngestionRepository {
  constructor(private readonly http: HttpClient) {}

  async start(sourceFile: SourceFile): Promise<IngestionJob> {
    const formData = new FormData();
    formData.append('file', sourceFile.content, sourceFile.name);

    try {
      const response = await firstValueFrom(
        this.http.post<UploadResponse>('/study-documents/upload', formData),
      );

      const { status, recoveryMessage } = fromBackendStatus(response.status);

      return IngestionJob.fromBackend(response.document_id, status, recoveryMessage);
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        const detail = error.error?.detail;
        if (detail?.code && detail?.message) {
          throw DomainError.createValidation(detail.message);
        }
      }
      throw DomainError.createValidation('Upload failed. Please try again.');
    }
  }

  async status(jobId: string): Promise<IngestionJob> {
    try {
      const response = await firstValueFrom(
        this.http.get<StatusResponse>(`/study-documents/${jobId}/status`),
      );

      const { status, recoveryMessage } = fromBackendStatus(
        response.status,
        response.failure_reason,
      );

      return IngestionJob.fromBackend(response.document_id, status, recoveryMessage);
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          throw DomainError.create('Session expired. Please log in again.');
        }
        if (error.status === 404) {
          throw DomainError.createNotFound('Document not found');
        }
      }
      throw DomainError.createValidation('Failed to retrieve status. Please try again.');
    }
  }
}
