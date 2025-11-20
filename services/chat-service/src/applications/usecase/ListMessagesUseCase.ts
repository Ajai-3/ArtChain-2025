import { inject, injectable } from "inversify";
import { Message } from "../../domain/entities/Message";
import { MessageMapper } from "../mappers/MessageMapper";
import { TYPES } from "../../infrastructure/Inversify/types";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { ListMessagesDto } from "../interface/dto/ListMessagesDto";
import { MessageResponseDto } from "../interface/dto/MessageResponseDto";
import { ListMessagesResponse } from "../interface/dto/ListMessageResponceDto";
import { IMessageCacheService } from "../interface/service/IMessageCacheService";
import { IListMessagesUseCase } from "../interface/usecase/IListMessagesUseCase";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";

@injectable()
export class ListMessagesUseCase implements IListMessagesUseCase {
  constructor(
    @inject(TYPES.IMessageCacheService)
    private readonly _cacheService: IMessageCacheService,
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async execute(dto: ListMessagesDto): Promise<ListMessagesResponse> {
    const { conversationId, requestUserId, limit, fromId } = dto;

    await this.validateConversationAccess(conversationId, requestUserId);

    let messages: Message[] = [];

    const cached = await this._cacheService.getCachedMessages(
      conversationId,
      limit,
      fromId
    );

    if (cached.length === limit) {
      messages = cached;
    } else {
      messages = await this._messageRepo.listByConversationPaginated(
        conversationId,
        limit,
        fromId
      );

      if (messages.length > 0) {
        await this._cacheService.cacheMessageList(conversationId, messages);
      }
    }

    const totalCount = await this._messageRepo.getTotalCountByConversation(
      conversationId
    );

    const hasMore = messages.length === limit;
    const nextFromId = hasMore ? messages[messages.length - 1].id : undefined;

    const responseMessages = this.mapToResponse(messages, requestUserId);

    return {
      messages: responseMessages,
      pagination: {
        hasMore,
        totalCount,
        nextFromId,
      },
    };
  }

  private async validateConversationAccess(
    conversationId: string,
    requestUserId: string
  ) {
    const conversation = await this._conversationRepo.findById(conversationId);
    if (!conversation) throw new NotFoundError("Conversation not found");
    if (!conversation.memberIds.includes(requestUserId)) {
      throw new BadRequestError("Not authorized");
    }
  }

  private mapToResponse(
    messages: Message[],
    requestUserId: string
  ): MessageResponseDto[] {
    return messages.map((msg) => MessageMapper.toResponse(msg, requestUserId));
  }
}
