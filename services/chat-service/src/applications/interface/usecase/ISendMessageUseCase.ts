import { SendMessageDto } from "../dto/SendMessageDto";
import { Message } from "../../../domain/entities/Message";

export interface ISendMessageUseCase {
  execute(dto: SendMessageDto): Promise<Message>;
}