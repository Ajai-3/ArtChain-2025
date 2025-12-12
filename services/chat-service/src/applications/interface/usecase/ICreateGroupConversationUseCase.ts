import { Conversation } from "../../../domain/entities/Conversation";
import { CreateGroupConversationDto } from "../dto/CreateGroupConversationDto";

export interface ICreateGroupConversationUseCase {
  execute(dto: CreateGroupConversationDto): Promise<Conversation>;
}
