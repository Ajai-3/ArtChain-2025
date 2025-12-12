import { Message, MediaType } from "../../domain/entities/Message";
import { DeleteMode } from "../../domain/entities/Message";
import { MessageResponseDto } from "../interface/dto/MessageResponseDto";
import { mapCdnUrl } from "../../utils/mapCdnUrl";

export class MessageMapper {
  static toResponse(
    message: Message,
    requestUserId: string
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
        content: null,
        mediaType: null,
        mediaUrl: null,
        isDeleted: true,
        readBy: message.readBy,
        deletedAt: message.deletedAt ?? null,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      };
    }

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      mediaType: message.mediaType ?? null,
      mediaUrl:
        message.mediaType === MediaType.IMAGE
          ? mapCdnUrl(message.content) ?? null
          : message.mediaUrl ?? null,
      isDeleted: false,
      readBy: message.readBy,
      deletedAt: message.deletedAt ?? null,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }
}
