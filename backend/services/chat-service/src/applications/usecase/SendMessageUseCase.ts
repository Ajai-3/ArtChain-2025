import { inject, injectable } from 'inversify';
import { BadRequestError } from 'art-chain-shared';
import { TYPES } from '../../infrastructure/Inversify/types';
import { SendMessageDto } from '../interface/dto/SendMessageDto';
import { ConversationType } from '../../domain/entities/Conversation';
import { DeleteMode, MediaType, Message } from '../../domain/entities/Message';
import { ISendMessageUseCase } from '../interface/usecase/ISendMessageUseCase';
import { IMessageCacheService } from '../interface/service/IMessageCacheService';
import { IMessageRepository } from '../../domain/repositories/IMessageRepositories';
import { IMessageBroadcastService } from '../../domain/service/IMessageBroadcastService';
import { IConversationRepository } from '../../domain/repositories/IConversationRepository';
import { IConversationCacheService } from '../interface/service/IConversationCacheService';
import { ERROR_MESSAGES } from '../../constants/messages';
import { mapCdnUrl } from '../../infrastructure/utils/mapCdnUrl';

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
    private readonly _conversationCacheService: IConversationCacheService,
  ) {}

  async execute(dto: SendMessageDto): Promise<void> {
    let { 
      senderId, 
      receiverId, 
      content, 
      conversationId, 
      tempId, 
      mediaType, 
      mediaUrl 
    } = dto;

    const isTextMessage = !mediaType || mediaType === MediaType.TEXT;
    const hasMedia = !!mediaUrl || (!!content && mediaType !== MediaType.TEXT);

    if (!content?.trim() && isTextMessage) {
      throw new BadRequestError(ERROR_MESSAGES.MESSAGE_CONTENT_EMPTY);
    }

    // Ensure content is not null for DB 'required' constraint
    const safeContent = content?.trim() || mediaUrl || '';

    if (!safeContent && !hasMedia) {
       throw new BadRequestError(ERROR_MESSAGES.MESSAGE_CONTENT_EMPTY);
    }

    conversationId = await this.resolveConversation(
      senderId,
      receiverId,
      conversationId,
    );

    const message = await this._messageRepo.create({
      conversationId,
      senderId,
      content: safeContent,
      mediaType: (mediaType as MediaType) || MediaType.TEXT,
      mediaUrl,
      readBy: [senderId],
      deleteMode: DeleteMode.NONE,
      callId: dto.callId,
      callStatus: dto.callStatus as any,
      callDuration: dto.callDuration,
    });

    await this._cacheService.cacheMessage(message);

    const broadcastMessage = { ...message };
    if (message.mediaType === MediaType.IMAGE && !message.mediaUrl) {
      // @ts-ignore
      broadcastMessage.mediaUrl = mapCdnUrl(message.content);
    }

    await this._broadcastService.publishMessage(
      broadcastMessage as Message,
      tempId,
    );
  }

  private async resolveConversation(
    senderId: string,
    receiverId?: string,
    conversationId?: string,
  ): Promise<string> {
    if (conversationId) {
      const conversation =
        await this._conversationRepo.findById(conversationId);

      if (!conversation)
        throw new BadRequestError(ERROR_MESSAGES.CONVERSATION_NOT_FOUND);

      await this._conversationCacheService.updateConversationMembers(
        conversation.id,
        conversation.memberIds,
      );

      if (
        conversation.type === ConversationType.PRIVATE &&
        !conversation.memberIds.includes(senderId)
      ) {
        throw new BadRequestError(ERROR_MESSAGES.NOT_ALLOWED_TO_SEND_MESSAGE);
      }

      if (conversation.type === ConversationType.GROUP) {
        if (!conversation.memberIds.includes(senderId)) {
          throw new BadRequestError(ERROR_MESSAGES.NOT_ALLOWED_TO_SEND_MESSAGE);
        }
      }

      return conversationId;
    }

    if (!receiverId)
      throw new BadRequestError(ERROR_MESSAGES.RECEIVER_ID_REQUIRED);

    let existing = await this._conversationRepo.findPrivateConversation(
      senderId,
      receiverId,
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
      conversation.memberIds,
    );

    return conversation.id;
  }
}
