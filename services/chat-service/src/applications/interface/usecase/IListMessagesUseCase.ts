import { ListMessagesDto } from "../dto/ListMessagesDto";
import { MessageResponseDto } from "../dto/MessageResponseDto";

export interface IListMessagesUseCase {
  execute(dto: ListMessagesDto): Promise<MessageResponseDto[]>;
}