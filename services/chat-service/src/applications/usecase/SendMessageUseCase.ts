import { inject, injectable } from "inversify";
import { BadRequestError } from "art-chain-shared";
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

    if (!content || content.trim() === "") {
      throw new BadRequestError("Message content cannot be empty");
    }

    if (!conversationId) {
      if (!receiverId) {
        throw new BadRequestError("receiverId is required for first message");
      }

      let existing = await this._conversationRepo.findPrivateConversation(
        senderId,
        receiverId
      );

      if (existing) {
        conversationId = existing.id;
      } else {
        const conversation = await this._conversationRepo.create({
          type: ConversationType.PRIVATE,
          memberIds: [senderId, receiverId],
          locked: false,
          adminIds: [],
        });
        conversationId = conversation.id;
      }
    } else {
      const conversation = await this._conversationRepo.findById(
        conversationId
      );
      if (!conversation) {
        throw new BadRequestError("Conversation not found");
      }

      if (
        conversation.type === ConversationType.PRIVATE &&
        !conversation.memberIds.includes(senderId)
      ) {
        throw new BadRequestError(
          "You are not allowed to send message to this conversation"
        );
      }
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
