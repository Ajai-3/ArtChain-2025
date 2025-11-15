import { DeleteMessageDto } from "../dto/DeleteMessageDto";

export interface IDeleteMessageUseCase {
  execute(dto: DeleteMessageDto): Promise<boolean>;
}