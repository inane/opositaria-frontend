import { signal, computed } from '@angular/core';
import { GetStudySpaceConversationUseCase } from '../../application/GetStudySpaceConversationUseCase';
import { SendStudySpaceCopilotMessageUseCase } from '../../application/SendStudySpaceCopilotMessageUseCase';
import { ClearStudySpaceConversationUseCase } from '../../application/ClearStudySpaceConversationUseCase';
import { CopilotConversation } from '../../domain/entities/CopilotConversation';
import { CopilotAvailabilityState } from '../../domain/entities/CopilotAvailability';
import { DomainError } from '../../domain/DomainError';

export type ConversationLoadingState = 'idle' | 'loading' | 'loaded' | 'error';

export class StudySpaceCopilotStore {
  private readonly conversationSignal = signal<CopilotConversation>(CopilotConversation.create([]));
  private readonly loadingStateSignal = signal<ConversationLoadingState>('idle');
  private readonly errorMessageSignal = signal('');
  private readonly isSendingSignal = signal(false);
  private readonly sendErrorMessageSignal = signal('');
  private readonly isClearingSignal = signal(false);
  private readonly clearErrorMessageSignal = signal('');
  private readonly availabilitySignal = signal<CopilotAvailabilityState>('empty');

  readonly conversation = this.conversationSignal.asReadonly();
  readonly loadingState = this.loadingStateSignal.asReadonly();
  readonly errorMessage = this.errorMessageSignal.asReadonly();
  readonly isSending = this.isSendingSignal.asReadonly();
  readonly sendErrorMessage = this.sendErrorMessageSignal.asReadonly();
  readonly isClearing = this.isClearingSignal.asReadonly();
  readonly clearErrorMessage = this.clearErrorMessageSignal.asReadonly();
  readonly availability = this.availabilitySignal.asReadonly();

  readonly isLoading = computed(() => this.loadingStateSignal() === 'loading');
  readonly isLoaded = computed(() => this.loadingStateSignal() === 'loaded');
  readonly hasError = computed(() => this.loadingStateSignal() === 'error');
  readonly canSendMessage = computed(() => this.availabilitySignal() === 'available' && !this.isSendingSignal());

  constructor(
    private readonly getConversationUseCase: GetStudySpaceConversationUseCase,
    private readonly sendMessageUseCase: SendStudySpaceCopilotMessageUseCase,
    private readonly clearConversationUseCase: ClearStudySpaceConversationUseCase,
  ) {}

  setAvailability(availability: CopilotAvailabilityState): void {
    this.availabilitySignal.set(availability);
  }

  async load(spaceId: string): Promise<void> {
    this.loadingStateSignal.set('loading');
    this.errorMessageSignal.set('');

    try {
      const conversation = await this.getConversationUseCase.execute(spaceId);
      this.conversationSignal.set(conversation);
      this.loadingStateSignal.set('loaded');
    } catch {
      this.conversationSignal.set(CopilotConversation.create([]));
      this.loadingStateSignal.set('error');
      this.errorMessageSignal.set('Failed to load conversation. Please try again.');
    }
  }

  async send(spaceId: string, content: string): Promise<void> {
    if (content.trim().length === 0) {
      throw DomainError.createValidation('Message cannot be blank');
    }

    this.isSendingSignal.set(true);
    this.sendErrorMessageSignal.set('');

    try {
      const conversation = await this.sendMessageUseCase.execute(spaceId, content);
      this.conversationSignal.set(conversation);
    } catch (error) {
      if (error instanceof DomainError) {
        this.sendErrorMessageSignal.set(error.message);
      } else {
        this.sendErrorMessageSignal.set('Failed to send message. Please try again.');
      }
    } finally {
      this.isSendingSignal.set(false);
    }
  }

  async clear(spaceId: string): Promise<void> {
    this.isClearingSignal.set(true);
    this.clearErrorMessageSignal.set('');

    try {
      await this.clearConversationUseCase.execute(spaceId);
      this.conversationSignal.set(CopilotConversation.create([]));
    } catch (error) {
      if (error instanceof DomainError) {
        this.clearErrorMessageSignal.set(error.message);
      } else {
        this.clearErrorMessageSignal.set('Failed to clear conversation. Please try again.');
      }
    } finally {
      this.isClearingSignal.set(false);
    }
  }
}
