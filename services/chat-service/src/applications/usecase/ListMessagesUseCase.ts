import { inject, injectable } from "inversify";
import { Message } from "../../domain/entities/Message";
import { MessageMapper } from "../mappers/MessageMapper";
import { TYPES } from "../../infrastructure/Inversify/types";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { ListMessagesDto } from "../interface/dto/ListMessagesDto";
import { MessageResponseDto } from "../interface/dto/MessageResponseDto";
import { IMessageCacheService } from "../interface/service/IMessageCacheService";
import { IListMessagesUseCase } from "../interface/usecase/IListMessagesUseCase";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { ListMessagesResponse } from "../interface/dto/ListMessageResponceDto";
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
    const { conversationId, requestUserId, page, limit, fromId } = dto;

    console.log("🚀 ListMessagesUseCase executing with:", dto);

    const conversation = await this.validateConversationAccess(
      conversationId,
      requestUserId
    );

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    console.log(
      `📊 Fetching messages: start=${start}, end=${end}, limit=${limit}`
    );

    // Try cache first
    let messages = await this._cacheService.getCachedMessages(
      conversationId,
      start,
      end
    );

    console.log(`💾 Cache returned ${messages.length} messages`);

    // Fallback to DB if cache incomplete
    if (messages.length < limit) {
      console.log(`🔄 Cache incomplete, querying database...`);
      const dbMessages = await this._messageRepo.listByConversationPaginated(
        conversationId,
        limit,
        fromId,
        start,
      );
      console.log(`🗃️ Database returned ${dbMessages.length} messages`);
      messages = dbMessages;

      if (page === 1) {
        console.log(`💡 Caching messages for conversation ${conversationId}`);
        await this._cacheService.cacheMessageList(conversationId, dbMessages);
      }
    }

    // NEW: Get total count for pagination
    const totalCount = await this._messageRepo.getTotalCountByConversation(
      conversationId
    );
    const hasMore = start + messages.length < totalCount;
    const nextPage = hasMore ? page + 1 : undefined;

    const responseMessages = this.mapToResponse(messages, requestUserId);

    console.log(
      `✅ Returning ${responseMessages.length} messages with pagination`
    );

    return {
      messages: responseMessages,
      pagination: {
        currentPage: page,
        hasMore,
        totalCount,
        nextPage,
      },
    };
  }

  private async validateConversationAccess(
    conversationId: string,
    requestUserId: string
  ) {
    console.log(
      `🔐 Validating access for user ${requestUserId} to conversation ${conversationId}`
    );

    const conversation = await this._conversationRepo.findById(conversationId);
    if (!conversation) throw new NotFoundError("Conversation not found");

    console.log(`👥 Conversation members:`, conversation.memberIds);

    const isMember = conversation.memberIds.includes(requestUserId);

    if (!isMember) {
      throw new BadRequestError("Not authorized to view this conversation");
    }

    console.log(`✅ User authorized`);
    return conversation;
  }

  private mapToResponse(
    messages: Message[],
    requestUserId: string
  ): MessageResponseDto[] {
    const response = messages.map((msg) =>
      MessageMapper.toResponse(msg, requestUserId)
    );
    console.log(`📨 Mapped ${response.length} messages to response DTO`);
    return response;
  }
}
