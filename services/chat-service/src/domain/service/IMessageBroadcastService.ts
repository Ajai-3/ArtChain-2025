import { Message } from "../entities/Message";

export interface IMessageBroadcastService {
  publishMessage(message: Message, tempId?: string): Promise<void>;
  publishDelete(messageId: string, conversationId: string): Promise<void>;
}