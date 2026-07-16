import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { StudySpaceRepository } from '../../domain/repositories/StudySpaceRepository';
import { StudySpace } from '../../domain/entities/StudySpace';
import { DomainError } from '../../domain/entities/DomainError';

interface BackendStudySpaceSummary {
  id: string;
  name: string;
  document_count: number;
  created_at: string;
}

interface CreateStudySpaceRequest {
  name: string;
  document_ids: string[];
}

@Injectable({ providedIn: 'root' })
export class HttpStudySpaceAdapter implements StudySpaceRepository {
  constructor(private readonly http: HttpClient) {}

  async listAll(): Promise<StudySpace[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<BackendStudySpaceSummary[]>('/study-spaces'),
      );

      return response.map((s) =>
        StudySpace.create({
          id: s.id,
          title: s.name,
          sourceCount: s.document_count,
          createdAt: new Date(s.created_at),
          isOwned: true,
          isFeatured: false,
        }),
      );
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          throw DomainError.create('Session expired. Please log in again.');
        }
      }
      throw DomainError.create('Failed to load study spaces. Please try again.');
    }
  }

  async save(space: StudySpace): Promise<void> {
    // Not used - creation goes through createStudySpace instead
  }

  async createStudySpace(name: string, documentIds: string[]): Promise<StudySpace> {
    try {
      const response = await firstValueFrom(
        this.http.post<BackendStudySpaceSummary>('/study-spaces', {
          name,
          document_ids: documentIds,
        } satisfies CreateStudySpaceRequest),
      );

      return StudySpace.create({
        id: response.id,
        title: response.name,
        sourceCount: response.document_count,
        createdAt: new Date(response.created_at),
        isOwned: true,
        isFeatured: false,
      });
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        const detail = error.error?.detail;
        if (error.status === 409 && detail?.code === 'document_not_ready') {
          throw DomainError.createValidation(detail.message || 'Document is not ready yet.');
        }
        if (error.status === 422 && detail?.code === 'invalid_name') {
          throw DomainError.createValidation(detail.message || 'Name is required.');
        }
        if (error.status === 401) {
          throw DomainError.create('Session expired. Please log in again.');
        }
      }
      throw DomainError.create('Failed to create study space. Please try again.');
    }
  }
}