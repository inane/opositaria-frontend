import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { StudySpaceCopilotRepository } from '../../domain/repositories/StudySpaceCopilotRepository';
import { CopilotConversation } from '../../domain/entities/CopilotConversation';
import { CopilotMessage, CopilotMessageRole } from '../../domain/entities/CopilotMessage';
import { DomainError } from '../../domain/DomainError';

interface BackendMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

interface ConversationResponse {
  messages: BackendMessage[];
}

function mapMessage(msg: BackendMessage): CopilotMessage {
  return CopilotMessage.create({
    id: msg.id,
    role: msg.role as CopilotMessageRole,
    content: msg.content,
    createdAt: new Date(msg.created_at),
  });
}

@Injectable({ providedIn: 'root' })
export class HttpStudySpaceCopilotAdapter implements StudySpaceCopilotRepository {
  constructor(private readonly http: HttpClient) {}

  async getConversation(spaceId: string): Promise<CopilotConversation> {
    try {
      const response = await firstValueFrom(
        this.http.get<ConversationResponse>(`/study-spaces/${spaceId}/conversation`),
      );

      return CopilotConversation.create(response.messages.map(mapMessage));
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          throw DomainError.create('Session expired. Please log in again.');
        }
        if (error.status === 404) {
          throw DomainError.createNotFound('Study space not found or not accessible');
        }
      }
      throw DomainError.create('Failed to load conversation. Please try again.');
    }
  }

  async sendMessage(spaceId: string, content: string): Promise<CopilotConversation> {
    try {
      const response = await firstValueFrom(
        this.http.post<ConversationResponse>(
          `/study-spaces/${spaceId}/conversation/messages`,
          { content },
        ),
      );

      return CopilotConversation.create(response.messages.map(mapMessage));
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          throw DomainError.create('Session expired. Please log in again.');
        }
        if (error.status === 404) {
          throw DomainError.createNotFound('Study space not found or not accessible');
        }
        if (error.status === 422) {
          throw DomainError.createValidation('Message cannot be blank');
        }
      }
      throw DomainError.create('Failed to send message. Please try again.');
    }
  }

  async clearConversation(spaceId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete(`/study-spaces/${spaceId}/conversation`),
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
      throw DomainError.create('Failed to clear conversation. Please try again.');
    }
  }
}
