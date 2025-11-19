export interface ListMessagesDto {
  page: number;
  limit: number;
  fromId: string;
  conversationId: string;
  requestUserId: string;
}