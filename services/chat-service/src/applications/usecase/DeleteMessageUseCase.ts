import { inject, injectable } from "inversify";
import { Message } from "../../domain/entities/Message";
import { TYPES } from "../../infrastructure/Inversify/types";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { DeleteMessageDto } from "../interface/dto/DeleteMessageDto";
import { ConversationType } from "../../domain/entities/Conversation";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IDeleteMessageUseCase } from "./../interface/usecase/IDeleteMessageUseCase";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";

@injectable()
export class DeleteMessageUseCase implements IDeleteMessageUseCase {
  private readonly DELETE_WINDOW_MS = 15 * 60 * 1000;

  constructor(
    @inject(TYPES.IMessageRepository)
    private readonly _repo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async execute(dto: DeleteMessageDto): Promise<boolean> {
    const { mode, messageId, userId } = dto;

    if (!messageId) throw new BadRequestError("MessageId is required");
    if (!userId) throw new BadRequestError("UserId is required");

    const message = await this._repo.findById(messageId);
    if (!message) throw new NotFoundError("Message not found");

    if (mode === "ME") {
      return this.deleteForMe(message, userId);
    }

    if (mode === "EVERYONE") {
      return this.deleteForEveryone(message, userId);
    }

    throw new BadRequestError("Invalid delete mode");
  }

  private async deleteForMe(message: Message, userId: string) {
    if (message.deletedFor.includes(userId)) return true;

    await this._repo.update(message.id, {
      deletedFor: [...message.deletedFor, userId],
    });

    return true;
  }

  private async deleteForEveryone(message: Message, userId: string) {
    const conversation = await this._conversationRepo.findById(
      message.conversationId
    );

    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }

    if (conversation.type === ConversationType.PRIVATE) {
      if (message.senderId !== userId) {
        throw new BadRequestError("Only sender can delete this message");
      }
    } else if (conversation.type === ConversationType.GROUP) {
      const isSender = message.senderId === userId;
      const isAdmin = conversation.adminIds?.includes(userId) ?? false;

      if (!isSender && !isAdmin) {
        throw new BadRequestError(
          "Only sender or admin can delete for everyone"
        );
      }
    }

    const diff = Date.now() - (message.createdAt?.getTime() ?? 0);
    if (diff > this.DELETE_WINDOW_MS) {
      throw new BadRequestError("Deletion window expired");
    }

    await this._repo.update(message.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    return true;
  }
}
