import { inject, injectable } from "inversify";
import { Message } from "../../domain/entities/Message";
import { TYPES } from "../../infrastructure/Inversify/types";
import { SendMessageDto } from "../interface/dto/SendMessageDto";
import { ConversationType } from "../../domain/entities/Conversation";
import { ISendMessageUseCase } from "../interface/usecase/ISendMessageUseCase";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async execute(dto: SendMessageDto): Promise<Message> {
    let { senderId, receiverId, content, conversationId } = dto;

    let conversation = await this._conversationRepo.findById(
      dto.conversationId
    );

    if (!conversation) {
      conversation = await this._conversationRepo.create({
        type: ConversationType.PRIVATE,
        memberIds: [senderId, receiverId],
        locked: false,
        adminIds: [],
      });

      conversationId = conversation.id;
    }

    const message = await this._messageRepo.create({
      conversationId,
      senderId,
      content,
      readBy: [],
      isDeleted: false,
      deletedFor: [],
    });

    return message;
  }
}
