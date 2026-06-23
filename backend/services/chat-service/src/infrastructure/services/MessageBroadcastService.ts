import { injectable } from 'inversify';
import { redisPub } from '../config/redis';
import { Message } from '../../domain/entities/Message';
import { Conversation } from '../../domain/entities/Conversation';
import { IMessageBroadcastService } from '../../domain/service/IMessageBroadcastService';
import { GroupUpdateData } from '../../types';

@injectable()
export class MessageBroadcastService implements IMessageBroadcastService {
  private readonly CHANNEL = 'chat_messages';

  async publishMessage(message: Message, tempId: string): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: 'new_message',
        conversationId: message.conversationId,
        message: message,
        tempId
      })
    );
  }

  async publishDelete(
    messageId: string,
    conversationId: string,
    deleteMode: string,
    userId: string
  ): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: 'delete_message',
        conversationId: conversationId,
        messageId: messageId,
        deleteMode: deleteMode,
        userId: userId,
      })
    );
  }

  async publishNewPrivateConversation(
    conversation: Conversation,
    recipientId: string
  ): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: 'new_private_conversation',
        conversationId: conversation.id,
        conversation: conversation,
        recipientId: recipientId,
      })
    );
  }

  async publishNewGroupConversation(
    conversation: Conversation,
    memberIds: string[]
  ): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: 'new_group_conversation',
        conversationId: conversation.id,
        conversation: conversation,
        memberIds: memberIds,
      })
    );
  }

  async publishGroupUpdate(
    conversationId: string,
    updateType: string,
    data: GroupUpdateData
  ): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: 'group_update',
        conversationId,
        updateType,
        data,
      })
    );
  }
}
