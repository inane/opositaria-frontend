import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { StudySpaceDocumentRepository } from '../../domain/repositories/StudySpaceDocumentRepository';
import { StudySpaceDocument, StudySpaceDocumentStatus } from '../../domain/entities/StudySpaceDocument';
import { DomainError } from '../../domain/DomainError';

interface BackendDocument {
  id: string;
  filename: string;
  status: string;
  chunks_count: number;
  created_at: string;
  updated_at: string;
}

function mapDocumentStatus(status: string): StudySpaceDocumentStatus {
  if (status === 'ready' || status === 'done') return 'ready';
  if (status === 'processing') return 'processing';
  if (status === 'error' || status === 'failed') return 'error';
  return 'pending';
}

@Injectable({ providedIn: 'root' })
export class HttpStudySpaceDocumentAdapter implements StudySpaceDocumentRepository {
  constructor(private readonly http: HttpClient) {}

  async listBySpace(spaceId: string): Promise<StudySpaceDocument[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<BackendDocument[]>(`/study-spaces/${spaceId}/documents`),
      );

      return response.map((doc) =>
        StudySpaceDocument.create({
          id: doc.id,
          filename: doc.filename,
          status: mapDocumentStatus(doc.status),
          chunksCount: doc.chunks_count,
          createdAt: new Date(doc.created_at),
          updatedAt: new Date(doc.updated_at),
        }),
      );
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          throw DomainError.create('Session expired. Please log in again.');
        }
        if (error.status === 404) {
          throw DomainError.createNotFound('Study space not found or not accessible');
        }
      }
      throw DomainError.create('Failed to load documents. Please try again.');
    }
  }

  async addDocument(spaceId: string, documentId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`/study-spaces/${spaceId}/documents`, { document_id: documentId }),
      );
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          throw DomainError.create('Session expired. Please log in again.');
        }
        if (error.status === 404) {
          throw DomainError.createNotFound('Study space not found or not accessible');
        }
        if (error.status === 409) {
          throw DomainError.createValidation('This document is already in the study space');
        }
        if (error.status === 422) {
          throw DomainError.createValidation('The document is not ready yet. Please wait for processing to complete.');
        }
      }
      throw DomainError.create('Failed to add document. Please try again.');
    }
  }

  async deleteDocument(spaceId: string, documentId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete(`/study-spaces/${spaceId}/documents/${documentId}`),
      );
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          throw DomainError.create('Session expired. Please log in again.');
        }
        if (error.status === 404) {
          throw DomainError.createNotFound('Document not found or not accessible');
        }
      }
      throw DomainError.create('Failed to delete document. Please try again.');
    }
  }
}
