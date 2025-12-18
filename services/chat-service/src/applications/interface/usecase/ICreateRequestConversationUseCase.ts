import { CreateRequestConversationDto } from "../dto/CreateRequestConversationDto";
import { CreatePrivateConversationResponseDto } from "../dto/CreatePrivateConversationResponseDto";

export interface ICreateRequestConversationUseCase {
  execute(
    dto: CreateRequestConversationDto
  ): Promise<CreatePrivateConversationResponseDto>;
}
