import { Component, input, output, signal, ElementRef, effect, viewChild } from '@angular/core';
import { CopilotConversation } from '../../domain/entities/CopilotConversation';
import { CopilotAvailabilityState } from '../../domain/entities/CopilotAvailability';

@Component({
  selector: 'app-study-space-copilot-panel',
  template: `
    <div class="copilot-panel">
      <h2>Copilot</h2>
      @if (isLoading()) {
        <p class="loading-text">Loading conversation...</p>
      } @else if (hasError()) {
        <div class="error-state" role="alert">
          <p>{{ errorMessage() }}</p>
          <button type="button" class="retry-button" (click)="retry.emit()">Retry</button>
        </div>
      } @else {
        @if (conversation().isEmpty) {
          <div class="empty-state">
            <p>No conversation yet. Start chatting with your study copilot.</p>
          </div>
        } @else {
          <button type="button" class="clear-button" (click)="requestClear()">
            Clear conversation
          </button>
          <div class="message-list" role="log" aria-label="Conversation history">
            @for (msg of conversation().messages; track msg.id) {
              <div class="message" [attr.data-role]="msg.role">
                <span class="message-role">{{ msg.role }}</span>
                <p class="message-content">{{ msg.content }}</p>
              </div>
            }
          </div>
        }
        @if (availability() !== 'available') {
          <div class="unavailable-notice" role="status">
            @switch (availability()) {
              @case ('empty') {
                <p>Add documents before asking questions.</p>
              }
              @case ('processing') {
                <p>Documents are processing. Copilot will be available shortly.</p>
              }
              @case ('no-ready-documents') {
                <p>Wait for documents to finish processing.</p>
              }
            }
          </div>
        }
        <div class="input-area">
          <input
            type="text"
            class="copilot-input"
            placeholder="Ask a question..."
            [disabled]="!canSendMessage()"
            [value]="inputValue()"
            (input)="inputValue.set($any($event.target).value)"
            (keydown.enter)="handleSend()"
            aria-label="Ask copilot a question"
          />
          <button
            type="button"
            class="send-button"
            [disabled]="!canSendMessage() || inputValue().trim().length === 0"
            (click)="handleSend()"
          >
            Send
          </button>
        </div>
        @if (sendErrorMessage()) {
          <p class="send-error" role="alert">{{ sendErrorMessage() }}</p>
        }
        @if (clearErrorMessage()) {
          <p class="clear-error" role="alert">{{ clearErrorMessage() }}</p>
        }
        @if (isConfirmingClear()) {
          <section
            #clearDialog
            class="confirmation"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-conversation-title"
            tabindex="-1"
            (keydown.escape)="cancelClear()"
            (keydown.enter)="confirmClear()"
          >
            <h3 id="clear-conversation-title">Clear conversation?</h3>
            <p>This removes the visible copilot history for this study space.</p>
            <div class="confirmation-actions">
              <button type="button" class="cancel-button" (click)="cancelClear()">Cancel</button>
              <button type="button" class="confirm-button" (click)="confirmClear()">Clear conversation</button>
            </div>
          </section>
        }
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .copilot-panel {
      background: var(--opo-color-surface);
      border-radius: var(--opo-radius-lg);
      padding: var(--opo-space-4);
      box-shadow: var(--opo-shadow-sm);
      display: flex;
      flex-direction: column;
      min-height: 400px;
    }
    .copilot-panel h2 {
      margin: 0 0 var(--opo-space-3);
      font-size: 1.125rem;
    }
    .loading-text {
      color: var(--opo-color-text-muted);
    }
    .error-state {
      color: var(--opo-color-danger);
    }
    .retry-button {
      margin-top: var(--opo-space-2);
      padding: var(--opo-space-2) var(--opo-space-4);
      background: var(--opo-color-surface-muted);
      border: none;
      border-radius: var(--opo-radius-sm);
      cursor: pointer;
    }
    .empty-state {
      color: var(--opo-color-text-muted);
      text-align: center;
      padding: var(--opo-space-8) var(--opo-space-4);
      flex: 1;
    }
    .message-list {
      flex: 1;
      overflow-y: auto;
      margin-bottom: var(--opo-space-3);
    }
    .clear-button,
    .cancel-button,
    .confirm-button {
      min-height: 2.75rem;
      padding: var(--opo-space-2) var(--opo-space-3);
      border: 1px solid var(--opo-color-text-alpha-12);
      border-radius: var(--opo-radius-sm);
      background: var(--opo-color-surface);
      cursor: pointer;
    }
    .clear-button {
      align-self: flex-start;
      margin-bottom: var(--opo-space-3);
    }
    .message {
      margin-bottom: var(--opo-space-3);
    }
    .message-role {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--opo-color-text-muted);
    }
    .message-content {
      margin: var(--opo-space-1) 0 0;
      padding: var(--opo-space-2) var(--opo-space-3);
      background: var(--opo-color-surface-muted);
      border-radius: var(--opo-radius-md);
    }
    .message[data-role="assistant"] .message-content {
      background: var(--opo-color-primary-alpha-8);
    }
    .unavailable-notice {
      padding: var(--opo-space-3);
      background: var(--opo-color-warning-alpha-8);
      border-radius: var(--opo-radius-md);
      margin-bottom: var(--opo-space-3);
      font-size: 0.875rem;
      color: var(--opo-color-warning);
    }
    .unavailable-notice p {
      margin: 0;
    }
    .input-area {
      display: flex;
      gap: var(--opo-space-2);
    }
    .copilot-input {
      flex: 1;
      padding: var(--opo-space-3);
      border: 1px solid var(--opo-color-text-alpha-8);
      border-radius: var(--opo-radius-md);
      font: inherit;
    }
    .copilot-input:disabled {
      background: var(--opo-color-surface-muted);
      cursor: not-allowed;
    }
    .send-button {
      padding: var(--opo-space-3) var(--opo-space-4);
      background: var(--opo-color-primary);
      color: var(--opo-color-primary-contrast);
      border: none;
      border-radius: var(--opo-radius-md);
      cursor: pointer;
    }
    .send-button:disabled {
      background: var(--opo-color-primary-alpha-28);
      cursor: not-allowed;
    }
    .send-error,
    .clear-error {
      color: var(--opo-color-danger);
      font-size: 0.875rem;
      margin: var(--opo-space-2) 0 0;
    }
    .confirmation {
      margin-top: var(--opo-space-4);
      padding: var(--opo-space-4);
      border: 1px solid var(--opo-color-primary-alpha-20);
      border-radius: var(--opo-radius-md);
      background: var(--opo-color-primary-alpha-8);
    }
    .confirmation h3,
    .confirmation p {
      margin: 0 0 var(--opo-space-3);
    }
    .confirmation-actions {
      display: flex;
      gap: var(--opo-space-2);
    }
    .confirm-button {
      background: var(--opo-color-primary);
      color: var(--opo-color-primary-contrast);
      border-color: var(--opo-color-primary);
    }
  `],
})
export class StudySpaceCopilotPanelComponent {
  readonly conversation = input.required<CopilotConversation>();
  readonly isLoading = input(false);
  readonly hasError = input(false);
  readonly errorMessage = input('');
  readonly availability = input<CopilotAvailabilityState>('empty');
  readonly canSendMessage = input(false);
  readonly sendErrorMessage = input('');
  readonly clearErrorMessage = input('');
  readonly retry = output();
  readonly sendMessage = output<string>();
  readonly clearConversation = output();

  readonly inputValue = signal('');
  readonly isConfirmingClear = signal(false);

  private readonly clearDialog = viewChild<ElementRef<HTMLElement>>('clearDialog');

  constructor() {
    effect(() => {
      const dialog = this.clearDialog();
      if (dialog) {
        queueMicrotask(() => dialog.nativeElement.focus());
      }
    });
  }

  handleSend(): void {
    const content = this.inputValue().trim();
    if (content.length > 0) {
      this.sendMessage.emit(content);
      this.inputValue.set('');
    }
  }

  requestClear(): void {
    this.isConfirmingClear.set(true);
  }

  cancelClear(): void {
    this.isConfirmingClear.set(false);
  }

  confirmClear(): void {
    this.clearConversation.emit();
    this.isConfirmingClear.set(false);
  }
}
