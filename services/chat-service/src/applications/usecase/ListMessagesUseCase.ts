import { inject, injectable } from "inversify";
import { BadRequestError } from "art-chain-shared";
import { MessageMapper } from "../mappers/MessageMapper";
import { TYPES } from "../../infrastructure/Inversify/types";
import { ListMessagesDto } from "../interface/dto/ListMessagesDto";
import { MessageResponseDto } from "../interface/dto/MessageResponseDto";
import { IListMessagesUseCase } from "../interface/usecase/IListMessagesUseCase";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { ConversationType } from "../../domain/entities/Conversation";

@injectable()
export class ListMessagesUseCase implements IListMessagesUseCase {
  constructor(
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async execute(dto: ListMessagesDto): Promise<MessageResponseDto[]> {
    const { conversationId, requestUserId, page, limit } = dto;

    if (page < 1 || limit < 1) {
      throw new Error("Page and limit must be greater than 0");
    }

    if (!conversationId) {
      throw new BadRequestError("ConversationId is required");
    }

    const conversation = await this._conversationRepo.findById(conversationId);
    if (!conversation) {
      throw new BadRequestError("Conversation not found");
    }

    if (
      conversation.type === ConversationType.PRIVATE &&
      !conversation.memberIds.includes(requestUserId)
    ) {
      throw new BadRequestError(
        "You are not authorized to view this conversation"
      );
    }

    const messages = await this._messageRepo.listByConversationPaginated(
      conversationId,
      limit,
      (page - 1) * limit
    );

    return messages.map((msg) => MessageMapper.toResponse(msg, requestUserId));
  }
}
