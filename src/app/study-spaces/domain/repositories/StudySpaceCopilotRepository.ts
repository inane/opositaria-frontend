import { CopilotConversation } from '../entities/CopilotConversation';
import { CopilotMessage } from '../entities/CopilotMessage';

export interface StudySpaceCopilotRepository {
  getConversation(spaceId: string): Promise<CopilotConversation>;
  sendMessage(spaceId: string, content: string): Promise<CopilotConversation>;
  clearConversation(spaceId: string): Promise<void>;
}

export class InMemoryStudySpaceCopilotRepository implements StudySpaceCopilotRepository {
  private readonly conversations: Map<string, CopilotMessage[]>;

  constructor(conversations?: Map<string, CopilotMessage[]>) {
    this.conversations = conversations ? new Map(conversations) : new Map();
  }

  async getConversation(spaceId: string): Promise<CopilotConversation> {
    const messages = this.conversations.get(spaceId) ?? [];
    return CopilotConversation.create([...messages]);
  }

  async sendMessage(spaceId: string, content: string): Promise<CopilotConversation> {
    const messages = this.conversations.get(spaceId) ?? [];

    const userMessage = CopilotMessage.create({
      role: 'user',
      content,
    });

    const assistantMessage = CopilotMessage.create({
      role: 'assistant',
      content: `Response to: ${content}`,
    });

    const updated = [...messages, userMessage, assistantMessage];
    this.conversations.set(spaceId, updated);

    return CopilotConversation.create([...updated]);
  }

  async clearConversation(spaceId: string): Promise<void> {
    this.conversations.delete(spaceId);
  }
}
