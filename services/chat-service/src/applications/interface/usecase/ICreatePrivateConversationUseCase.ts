import { CreatePrivateConversationDto } from "../dto/CreatePrivateConversationDto";

export interface ICreatePrivateConversationUseCase {
  execute(dto: CreatePrivateConversationDto): Promise<string>;
}