import { SendMessageDto } from "../dto/SendMessageDto";

export interface ISendMessageUseCase {
  execute(dto: SendMessageDto): Promise<void>;
}