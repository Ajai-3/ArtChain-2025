export interface ListMessagesDto {
  limit: number;
  fromId?: string;
  conversationId: string;
  requestUserId: string;
}