import { CreatePrivateConversationDto } from "../dto/CreatePrivateConversationDto";
import { CreatePrivateConversationResponseDto } from "../dto/CreatePrivateConversationResponseDto";

export interface ICreatePrivateConversationUseCase {
  execute(dto: CreatePrivateConversationDto): Promise<CreatePrivateConversationResponseDto>;
}