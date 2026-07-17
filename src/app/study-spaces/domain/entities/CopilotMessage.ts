import { DomainError } from '../DomainError';

export type CopilotMessageRole = 'user' | 'assistant';

export interface CopilotMessageParams {
  id?: string;
  role: CopilotMessageRole;
  content: string;
  createdAt?: Date;
}

export class CopilotMessage {
  private constructor(
    readonly id: string,
    readonly role: CopilotMessageRole,
    readonly content: string,
    readonly createdAt: Date,
  ) {}

  static create(params: CopilotMessageParams): CopilotMessage {
    if (params.content.trim().length === 0) {
      throw DomainError.createValidation('Copilot message content must not be empty');
    }

    return new CopilotMessage(
      params.id ?? crypto.randomUUID(),
      params.role,
      params.content,
      params.createdAt ?? new Date(),
    );
  }
}
