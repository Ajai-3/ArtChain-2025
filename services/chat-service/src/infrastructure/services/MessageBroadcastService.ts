import { injectable } from "inversify";
import { redisPub } from "../config/redis";
import { Message } from "../../domain/entities/Message";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";

@injectable()
export class MessageBroadcastService implements IMessageBroadcastService {
  private readonly CHANNEL = "chat_messages";

  async publishMessage(message: Message): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: "new_message",
        conversationId: message.conversationId,
        message: message,
      })
    );
  }

  async publishDelete(
    messageId: string,
    conversationId: string
  ): Promise<void> {
    await redisPub.publish(
      this.CHANNEL,
      JSON.stringify({
        type: "delete_message",
        conversationId: conversationId,
        messageId: messageId,
      })
    );
  }
}
