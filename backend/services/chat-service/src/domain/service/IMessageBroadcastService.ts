import { Message } from '../entities/Message';
import { Conversation } from '../entities/Conversation';
import { GroupUpdateData } from '../../types';

export interface IMessageBroadcastService {
  publishMessage(message: Message, tempId?: string): Promise<void>;
  publishDelete(messageId: string, conversationId: string, deleteMode: string, userId: string): Promise<void>;
  publishNewPrivateConversation(conversation: Conversation, recipientId: string): Promise<void>;
  publishNewGroupConversation(conversation: Conversation, memberIds: string[]): Promise<void>;
  publishGroupUpdate(conversationId: string, updateType: string, data: GroupUpdateData): Promise<void>;
}