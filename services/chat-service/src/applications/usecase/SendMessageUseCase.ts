import { inject, injectable } from "inversify";
import { BadRequestError } from "art-chain-shared";
import { TYPES } from "../../infrastructure/Inversify/types";
import { SendMessageDto } from "../interface/dto/SendMessageDto";
import { ConversationType } from "../../domain/entities/Conversation";
import { ISendMessageUseCase } from "../interface/usecase/ISendMessageUseCase";
import { DeleteMode, MediaType } from "../../domain/entities/Message";
import { IMessageCacheService } from "../interface/service/IMessageCacheService";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IConversationCacheService } from "../interface/service/IConversationCacheService";

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(TYPES.IMessageCacheService)
    private readonly _cacheService: IMessageCacheService,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository,
    @inject(TYPES.IMessageBroadcastService)
    private readonly _broadcastService: IMessageBroadcastService,
    @inject(TYPES.IConversationCacheService)
    private readonly _conversationCacheService: IConversationCacheService
  ) {}

  async execute(dto: SendMessageDto): Promise<void> {
    let { senderId, receiverId, content, conversationId, tempId } = dto;

    if (!content?.trim()) {
      throw new BadRequestError("Message content cannot be empty");
    }

    conversationId = await this.resolveConversation(
      senderId,
      receiverId,
      conversationId
    );

    // Create message in DB
    const message = await this._messageRepo.create({
      conversationId,
      senderId,
      content: content.trim(),
      mediaType: MediaType.TEXT,
      readBy: [senderId],
      deleteMode: DeleteMode.NONE,
    });

    await this._cacheService.cacheMessage(message);

    await this._broadcastService.publishMessage(message, tempId);
  }

  private async resolveConversation(
    senderId: string,
    receiverId?: string,
    conversationId?: string
  ): Promise<string> {
    if (conversationId) {
      const conversation = await this._conversationRepo.findById(
        conversationId
      );

      
      if (!conversation) throw new BadRequestError("Conversation not found");

      await this._conversationCacheService.updateConversationMembers(
        conversation.id,
        conversation.memberIds
      );

      if (
        conversation.type === ConversationType.PRIVATE &&
        !conversation.memberIds.includes(senderId)
      ) {
        throw new BadRequestError(
          "Not allowed to send message to this conversation"
        );
      }

      return conversationId;
    }

    if (!receiverId)
      throw new BadRequestError("receiverId is required for first message");

    let existing = await this._conversationRepo.findPrivateConversation(
      senderId,
      receiverId
    );
    if (existing) return existing.id;

    const conversation = await this._conversationRepo.create({
      type: ConversationType.PRIVATE,
      memberIds: [senderId, receiverId],
      locked: false,
      adminIds: [],
    });

     await this._conversationCacheService.cacheConversationMembers(
       conversation.id,
       conversation.memberIds
     );


    return conversation.id;
  }
}
