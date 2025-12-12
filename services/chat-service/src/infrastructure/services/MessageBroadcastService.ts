import { injectable } from "inversify";
import { redisPub } from "../config/redis";
import { Message } from "../../domain/entities/Message";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";

@injectable()
export class MessageBroadcastService implements IMessageBroadcastService {
  private readonly CHANNEL = "chat_messages";

  async publishMessage(message: Message, tempId: string): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: "new_message",
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
        type: "delete_message",
        conversationId: conversationId,
        messageId: messageId,
        deleteMode: deleteMode,
        userId: userId,
      })
    );
  }

  async publishNewPrivateConversation(
    conversation: any,
    recipientId: string
  ): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: "new_private_conversation",
        conversationId: conversation.id,
        conversation: conversation,
        recipientId: recipientId,
      })
    );
  }

  async publishNewGroupConversation(
    conversation: any,
    memberIds: string[]
  ): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: "new_group_conversation",
        conversationId: conversation.id,
        conversation: conversation,
        memberIds: memberIds,
      })
    );
  }

  async publishGroupUpdate(
    conversationId: string,
    updateType: string,
    data: any
  ): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: "group_update",
        conversationId,
        updateType,
        data,
      })
    );
  }
}
