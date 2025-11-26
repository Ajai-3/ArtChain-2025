export interface IMarkMessagesReadUseCase {
  execute(messageIds: string[], userId: string, conversationId: string): Promise<void>;
}
