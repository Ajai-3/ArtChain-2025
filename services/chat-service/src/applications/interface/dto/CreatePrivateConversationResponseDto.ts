import { Conversation } from "../../../domain/entities/Conversation";

export interface CreatePrivateConversationResponseDto {
  isNewConvo: boolean;
  conversation: Conversation;
}