export interface ListMessagesDto {
  page: number;
  limit: number;
  conversationId: string;
  requestUserId: string;
}