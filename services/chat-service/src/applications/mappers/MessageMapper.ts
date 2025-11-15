import { Message } from "../../domain/entities/Message";
import { MessageResponseDto } from "../interface/dto/MessageResponseDto";

export class MessageMapper {
  static toResponse(
    message: Message,
    requestUserId: string
  ): MessageResponseDto {
    // 1. Deleted for this user only
    if (message.deletedFor?.includes(requestUserId)) {
      return {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: null,
        mediaType: null,
        mediaUrl: null,
        isDeleted: true,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      };
    }

    // 2. Deleted for everyone
    if (message.isDeleted) {
      return {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: null,
        mediaType: null,
        mediaUrl: null,
        isDeleted: true,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      };
    }

    // 3. Normal message
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      mediaType: message.mediaType ?? null,
      mediaUrl: message.mediaUrl ?? null,
      isDeleted: false,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
