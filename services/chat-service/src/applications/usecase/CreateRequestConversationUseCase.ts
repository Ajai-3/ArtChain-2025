import { inject, injectable } from "inversify";
import { logger } from "../../infrastructure/utils/logger";
import { DeleteMode, MediaType, Message } from "../../domain/entities/Message";
import { TYPES } from "../../infrastructure/Inversify/types";
import { mapConversation } from "../mappers/mapConversations";
import { IUserService } from "../interface/http/IUserService";
import { ConversationType } from "../../domain/entities/Conversation";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { CreateRequestConversationDto } from "../interface/dto/CreateRequestConversationDto";
import { CreatePrivateConversationResponseDto } from "../interface/dto/CreatePrivateConversationResponseDto"; // Reusing response DTO
import { UserDto } from "../interface/dto/MessageResponseDto";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { ERROR_MESSAGES, DEFAULT_MESSAGES } from "../../constants/messages";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";


@injectable()
export class CreateRequestConversationUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(TYPES.IMessageBroadcastService)
    private readonly _broadcastService: IMessageBroadcastService
  ) {}

  async execute(
    dto: CreateRequestConversationDto
  ): Promise<CreatePrivateConversationResponseDto> {
    const { userId, artistId } = dto;

    if (!userId || !artistId) {
      throw new BadRequestError("User ID and Artist ID are required");
    }

    if (userId === artistId) {
      throw new BadRequestError(ERROR_MESSAGES.CANNOT_CREATE_CONVERSATION_WITH_SELF);
    }

    console.log(userId, artistId)
    
    const conversation = await this._conversationRepo.create({
      type: ConversationType.REQUEST,
      memberIds: [userId, artistId],
      locked: true,
      adminIds: [],
    });

    console.log(conversation)

    const isNewConvo = true;

    const partnerUser = await this._userService.getUserById(artistId);

    if (!partnerUser) {
      throw new NotFoundError(ERROR_MESSAGES.PARTNER_USER_NOT_FOUND);
    }

    const lastMessage = await this._messageRepo.create({
      conversationId: conversation.id,
      senderId: userId,
      content: "Hey, I want a commission art 🎨", 
      readBy: [userId],
      mediaType: MediaType.TEXT,
      deleteMode: DeleteMode.NONE,
    });

    const lastMap = new Map<string, Message>();
    const partnersMap = new Map<string, UserDto>();

    lastMap.set(conversation.id, lastMessage);
    partnersMap.set(artistId, partnerUser);

    const enrichedConversation = mapConversation({
      conversation: conversation,
      userId: userId,
      lastMap: lastMap,
      unreadMap: new Map<string, number>(),
      partnersMap: partnersMap,
    });

    logger.info(`Request conversation created: ${conversation.id}`);

    // Notify artist
    await this._broadcastService.publishNewPrivateConversation(
      enrichedConversation,
      artistId
    );

    return {
      isNewConvo,
      conversation: enrichedConversation,
    };
  }
}
