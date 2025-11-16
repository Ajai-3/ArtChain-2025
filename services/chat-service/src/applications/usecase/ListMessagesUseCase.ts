import { inject, injectable } from "inversify";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { Message } from "../../domain/entities/Message";
import { MessageMapper } from "../mappers/MessageMapper";
import { TYPES } from "../../infrastructure/Inversify/types";
import { ListMessagesDto } from "../interface/dto/ListMessagesDto";
import { IUserService } from "../interface/http/IUserService";
import { ConversationType } from "../../domain/entities/Conversation";
import { IMessageCacheService } from "../interface/service/IMessageCacheService";
import { IListMessagesUseCase } from "../interface/usecase/IListMessagesUseCase";
import {
  MessageResponseDto,
  UserDto,
} from "../interface/dto/MessageResponseDto";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";

@injectable()
export class ListMessagesUseCase implements IListMessagesUseCase {
  constructor(
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService,
    @inject(TYPES.IMessageCacheService)
    private readonly _cacheService: IMessageCacheService,
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async execute(dto: ListMessagesDto): Promise<MessageResponseDto[]> {
    const { conversationId, requestUserId, page, limit } = dto;

    this.validateInput(page, limit, conversationId);
    const conversation = await this.validateConversationAccess(
      conversationId,
      requestUserId
    );

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Try cache first
    let messages = await this._cacheService.getCachedMessages(
      conversationId,
      start,
      end
    );

    // Fallback to DB if cache incomplete
    if (messages.length < limit) {
      const dbMessages = await this._messageRepo.listByConversationPaginated(
        conversationId,
        limit,
        start
      );
      messages = dbMessages;

      // Cache the results for next time
      if (page === 1) {
        await this._cacheService.cacheMessageList(conversationId, dbMessages);
      }
    }

    return this.mapToResponse(messages, requestUserId, conversation);
  }

  private validateInput(
    page: number,
    limit: number,
    conversationId?: string
  ): void {
    if (page < 1 || limit < 1)
      throw new BadRequestError("Page and limit must be > 0");
    if (!conversationId)
      throw new BadRequestError("ConversationId is required");
  }

  private async validateConversationAccess(
    conversationId: string,
    requestUserId: string
  ) {
    const conversation = await this._conversationRepo.findById(conversationId);
    if (!conversation) throw new BadRequestError("Conversation not found");

    if (
      conversation.type === ConversationType.PRIVATE &&
      !conversation.memberIds.includes(requestUserId)
    ) {
      throw new BadRequestError("Not authorized to view this conversation");
    }

    return conversation;
  }

  private async mapToResponse(
    messages: Message[],
    requestUserId: string,
    conversation: any
  ): Promise<MessageResponseDto[]> {
    if (conversation.type === ConversationType.GROUP) {
      const senderIds = Array.from(new Set(messages.map((m) => m.senderId)));

      const users = await this._userService.getUsersByIds(senderIds);
      if (!users) throw new NotFoundError("Users not found");

      const userMap = new Map(users.map((u: UserDto) => [u.id, u]));

      return messages.map((msg) =>
        MessageMapper.toResponse(msg, requestUserId, userMap.get(msg.senderId))
      );
    }

    const otherUserId = conversation.memberIds.find(
      (id: string) => id !== requestUserId
    );
    let otherUser: UserDto | undefined;

    if (otherUserId) {
      const users = await this._userService.getUsersByIds([otherUserId]);
      if (!users) throw new NotFoundError("Users not found");
      otherUser = users[0];
    }

    return messages.map((msg) =>
      MessageMapper.toResponse(msg, requestUserId, otherUser)
    );
  }
}
