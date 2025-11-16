import { Message } from "../../domain/entities/Message";
import { DeleteMode } from "../../domain/entities/Message";
import {
  MessageResponseDto,
  UserDto,
} from "../interface/dto/MessageResponseDto";

export class MessageMapper {
  static toResponse(
    message: Message,
    requestUserId: string,
    sender?: UserDto
  ): MessageResponseDto {
    const isDeletedForRequester =
      message.deleteMode === DeleteMode.ALL ||
      (message.deleteMode === DeleteMode.ME &&
        message.senderId === requestUserId);

    if (isDeletedForRequester) {
      return {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        sender,
        content: null,
        mediaType: null,
        mediaUrl: null,
        isDeleted: true,
        deletedAt: message.deletedAt ?? null,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      };
    }

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      sender,
      content: message.content,
      mediaType: message.mediaType ?? null,
      mediaUrl: message.mediaUrl ?? null,
      isDeleted: false,
      deletedAt: message.deletedAt ?? null,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
