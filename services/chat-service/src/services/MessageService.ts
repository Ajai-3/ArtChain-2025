import { inject, injectable } from "inversify";
import { Message } from "../domain/entities/Message";
import { TYPES } from "../infrastructure/Inversify/types";
import { IMessageService } from "./interface/IMessageService";
import { redisCache, redisPub } from "./../infrastructure/config/redis";
import { SendMessageDto } from "../applications/interface/dto/SendMessageDto";
import { ListMessagesDto } from "../applications/interface/dto/ListMessagesDto";
import { DeleteMessageDto } from "../applications/interface/dto/DeleteMessageDto";
import { MessageResponseDto } from "../applications/interface/dto/MessageResponseDto";
import { ISendMessageUseCase } from "../applications/interface/usecase/ISendMessageUseCase";
import { IListMessagesUseCase } from "../applications/interface/usecase/IListMessagesUseCase";
import { IDeleteMessageUseCase } from "../applications/interface/usecase/IDeleteMessageUseCase";

@injectable()
export class MessageService implements IMessageService {
  constructor(
    @inject(TYPES.ISendMessageUseCase)
    private readonly _sendMessageUseCase: ISendMessageUseCase,
    @inject(TYPES.IListMessagesUseCase)
    private readonly _listMessagesUseCase: IListMessagesUseCase,
    @inject(TYPES.IDeleteMessageUseCase)
    private readonly _deleteMessageUseCase: IDeleteMessageUseCase
  ) {}

  // Send a message via use case + cache + broadcast
  sendMessage = async (dto: SendMessageDto): Promise<Message> => {
    const savedMessage = await this._sendMessageUseCase.execute(dto);

    // Cache last 50 messages
    await redisCache.rpush(
      `conversation:${savedMessage.conversationId}:messages`,
      JSON.stringify(savedMessage)
    );
    await redisCache.ltrim(
      `conversation:${savedMessage.conversationId}:messages`,
      -50,
      -1
    );

    // Publish to Redis for multi-instance broadcast
    await redisPub.publish("chat", JSON.stringify(savedMessage));

    return savedMessage;
  };

  // Get last 50 messages (use ListMessagesUseCase for pagination)
  getHistory = async (
    conversationId: string,
    requestUserId: string
  ): Promise<MessageResponseDto[]> => {
    // First try cache
    const cached = await redisCache.lrange(
      `conversation:${conversationId}:messages`,
      0,
      -1
    );

    if (cached.length > 0) {
      return cached.map((m) => JSON.parse(m));
    }

    // Fallback to use case
    const dto: ListMessagesDto = {
      conversationId,
      requestUserId,
      page: 1,
      limit: 50,
    };
    return this._listMessagesUseCase.execute(dto);
  };

  // Delete message (wrap delete use case)
  deleteMessage = async (dto: DeleteMessageDto): Promise<boolean> => {
    const result = await this._deleteMessageUseCase.execute(dto);

    if (result) {
      // Optional: remove from cache
      const cached = await redisCache.lrange(
        `conversation:${dto.messageId}:messages`,
        0,
        -1
      );
      const filtered = cached
        .map((m) => JSON.parse(m))
        .filter((m) => m.id !== dto.messageId);

      await redisCache.del(`conversation:${dto.messageId}:messages`);
      if (filtered.length > 0) {
        await redisCache.rpush(
          `conversation:${dto.messageId}:messages`,
          ...filtered.map((m) => JSON.stringify(m))
        );
      }

      // Optional: publish delete event
      await redisPub.publish(
        "chat",
        JSON.stringify({ type: "delete", messageId: dto.messageId })
      );
    }

    return result;
  };
}
