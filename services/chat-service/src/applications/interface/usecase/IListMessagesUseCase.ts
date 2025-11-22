import { ListMessagesDto } from "../dto/ListMessagesDto";
import { ListMessagesResponse } from "../dto/ListMessageResponceDto";

export interface IListMessagesUseCase {
  execute(dto: ListMessagesDto): Promise<ListMessagesResponse>;
}