import { CopilotMessage } from './CopilotMessage';

export class CopilotConversation {
  private constructor(readonly messages: readonly CopilotMessage[]) {}

  static create(messages: CopilotMessage[]): CopilotConversation {
    return new CopilotConversation([...messages]);
  }

  get isEmpty(): boolean {
    return this.messages.length === 0;
  }

  append(message: CopilotMessage): CopilotConversation {
    return new CopilotConversation([...this.messages, message]);
  }
}
