import { Message } from "../../domain/entities/Message";
import { SendMessageDto } from "../../applications/interface/dto/SendMessageDto";
import { DeleteMessageDto } from "../../applications/interface/dto/DeleteMessageDto";
import { MessageResponseDto } from "../../applications/interface/dto/MessageResponseDto";

export interface IMessageService {
  sendMessage: (dto: SendMessageDto) => Promise<Message>;
  getHistory: (
    conversationId: string,
    requestUserId: string
  ) => Promise<MessageResponseDto[]>;
  deleteMessage: (dto: DeleteMessageDto) => Promise<boolean>;
}