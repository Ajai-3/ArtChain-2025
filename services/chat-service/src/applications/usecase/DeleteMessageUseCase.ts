import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { DeleteMode, Message } from "../../domain/entities/Message";
import { DeleteMessageDto } from "../interface/dto/DeleteMessageDto";
import { ConversationType } from "../../domain/entities/Conversation";
import { IMessageCacheService } from "../interface/service/IMessageCacheService";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IDeleteMessageUseCase } from "./../interface/usecase/IDeleteMessageUseCase";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";

@injectable()
export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  private readonly DELETE_WINDOW_MS = 15 * 60 * 1000;

  constructor(
    @inject(TYPES.IMessageCacheService)
    private readonly _cacheService: IMessageCacheService,
    @inject(TYPES.IMessageRepository)
    private readonly _repo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(TYPES.IMessageBroadcastService)
    private readonly _broadcastService: IMessageBroadcastService
  ) {}

  async execute(dto: DeleteMessageDto): Promise<boolean> {
    const { mode, messageId, userId } = dto;

    if (!messageId || !userId) {
      throw new BadRequestError("MessageId and UserId are required");
    }

    const message = await this._repo.findById(messageId);
    if (!message) throw new NotFoundError("Message not found");

    if (mode === "ME") {
      return this.deleteForMe(message, userId);
    } else if (mode === "EVERYONE") {
      return this.deleteForEveryone(message, userId);
    } else {
      throw new BadRequestError("Invalid delete mode");
    }
  }

  private async deleteForMe(
    message: Message,
    userId: string
  ): Promise<boolean> {
    if (message.deleteMode === DeleteMode.ME) return true;

    await this._repo.update(message.id, {
      deleteMode: DeleteMode.ME,
      deletedAt: new Date(),
    });

    await this._cacheService.updateCachedMessage(message.id, {
      deleteMode: DeleteMode.ME,
      deletedAt: new Date(),
    });

    await this._broadcastService.publishDelete(
      message.id,
      message.conversationId
    );
    return true;
  }

  private async deleteForEveryone(
    message: Message,
    userId: string
  ): Promise<boolean> {
    const conversation = await this._conversationRepo.findById(
      message.conversationId
    );
    if (!conversation) throw new NotFoundError("Conversation not found");

    this.validateDeletePermission(message, userId, conversation);

    const diff = Date.now() - (message.createdAt?.getTime() ?? 0);
    if (diff > this.DELETE_WINDOW_MS) {
      throw new BadRequestError("Deletion window expired");
    }

    await this._repo.update(message.id, {
      deleteMode: DeleteMode.ALL,
      deletedAt: new Date(),
    });

    await this._cacheService.updateCachedMessage(message.id, {
      deleteMode: DeleteMode.ALL,
      deletedAt: new Date(),
    });

    await this._broadcastService.publishDelete(
      message.id,
      message.conversationId
    );
    return true;
  }

  private validateDeletePermission(
    message: Message,
    userId: string,
    conversation: any
  ): void {
    if (conversation.type === ConversationType.PRIVATE) {
      if (message.senderId !== userId) {
        throw new BadRequestError("Only sender can delete this message");
      }
    } else if (conversation.type === ConversationType.GROUP) {
      const isSender = message.senderId === userId;
      const isGroupOwner = conversation.ownerId === userId;
      const isAdmin = conversation.adminIds?.includes(userId) ?? false;

      if (!isSender && !isAdmin && !isGroupOwner) {
        throw new BadRequestError(
          "Only sender, admin, or group owner can delete for everyone"
        );
      }
    }
  }
}
