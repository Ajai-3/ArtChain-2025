import { Message } from "../entities/Message";

export interface IMessageBroadcastService {
  publishMessage(message: Message, tempId?: string): Promise<void>;
  publishDelete(messageId: string, conversationId: string, deleteMode: string, userId: string): Promise<void>;
  publishNewPrivateConversation(conversation: any, recipientId: string): Promise<void>;
  publishNewGroupConversation(conversation: any, memberIds: string[]): Promise<void>;
  publishGroupUpdate(conversationId: string, updateType: string, data: any): Promise<void>;
}