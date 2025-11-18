import { inject, injectable } from "inversify";
import { logger } from "../../infrastructure/utils/logger";
import { DeleteMode, MediaType } from "../../domain/entities/Message";
import { TYPES } from "../../infrastructure/Inversify/types";
import { mapConversation } from "../mappers/mapConversations";
import { IUserService } from "../interface/http/IUserService";
import { ConversationType } from "../../domain/entities/Conversation";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { CreatePrivateConversationDto } from "../interface/dto/CreatePrivateConversationDto";
import { ICreatePrivateConversationUseCase } from "../interface/usecase/ICreatePrivateConversationUseCase";
import { CreatePrivateConversationResponseDto } from "../interface/dto/CreatePrivateConversationResponseDto";

@injectable()
export class CreatePrivateConversationUseCase
  implements ICreatePrivateConversationUseCase
{
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async execute(
    dto: CreatePrivateConversationDto
  ): Promise<CreatePrivateConversationResponseDto> {
    const { userId, otherUserId } = dto;

    let isNewConvo = false;

    let conversation = await this._conversationRepo.findPrivateConversation(
      userId,
      otherUserId
    );

    console.log(conversation, "Already exists");

    if (!conversation) {
      conversation = await this._conversationRepo.create({
        type: ConversationType.PRIVATE,
        memberIds: [userId, otherUserId],
        locked: false,
        adminIds: [],
      });
      isNewConvo = true;
    }

    const partnerUser = await this._userService.getUserById(otherUserId);
    console.log("Partner user data:", partnerUser);

    if (!partnerUser) {
      throw new Error("Partner user not found");
    }

    let lastMessage;
    if (isNewConvo) {
      lastMessage = await this._messageRepo.create({
        conversationId: conversation.id,
        senderId: userId,
        content: "Hello! Looking forward to chatting with you!",
        readBy: [userId],
        mediaType: MediaType.TEXT,
        deleteMode: DeleteMode.NONE,
      });
    } else {
      const lastMessages = await this._messageRepo.getLastMessages([
        conversation.id,
      ]);
      lastMessage = lastMessages[0] || null;
    }

    const unreadCounts = await this._messageRepo.getUnreadCounts(
      [conversation.id],
      userId
    );
    const unreadCount =
      unreadCounts.find((u) => u.conversationId === conversation.id)?.count ||
      0;

    const lastMap = new Map();
    if (lastMessage) {
      lastMap.set(conversation.id, lastMessage);
    }

    const unreadMap = new Map();
    unreadMap.set(conversation.id, unreadCount);

    const partnersMap = new Map();
    partnersMap.set(otherUserId, partnerUser);

    const enrichedConversation = mapConversation({
      conversation: conversation,
      userId: userId,
      lastMap: lastMap,
      unreadMap: unreadMap,
      partnersMap: partnersMap,
    });

    console.log("Enriched conversation:", enrichedConversation);

    return { isNewConvo, conversation: enrichedConversation }; 
  }
}
