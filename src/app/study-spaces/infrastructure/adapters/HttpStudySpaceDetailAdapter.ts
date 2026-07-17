import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { StudySpaceDetailRepository } from '../../domain/repositories/StudySpaceDetailRepository';
import { StudySpaceDetail } from '../../domain/entities/StudySpaceDetail';
import { DomainError } from '../../domain/DomainError';

interface BackendStudySpaceDetail {
  id: string;
  name: string;
  document_count: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class HttpStudySpaceDetailAdapter implements StudySpaceDetailRepository {
  constructor(private readonly http: HttpClient) {}

  async getById(spaceId: string): Promise<StudySpaceDetail> {
    try {
      const response = await firstValueFrom(
        this.http.get<BackendStudySpaceDetail>(`/study-spaces/${spaceId}`),
      );

      return StudySpaceDetail.create({
        id: response.id,
        title: response.name,
        documentCount: response.document_count,
        createdAt: new Date(response.created_at),
      });
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          throw DomainError.create('Session expired. Please log in again.');
        }
        if (error.status === 404) {
          throw DomainError.createNotFound('Study space not found or not accessible');
        }
      }
      throw DomainError.create('Something went wrong. Please try again.');
    }
  }
}
