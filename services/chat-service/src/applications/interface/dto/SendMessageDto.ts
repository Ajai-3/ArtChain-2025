export interface SendMessageDto {
  tempId?: string;
  content: string;
  senderId: string;
  receiverId?: string;
  conversationId: string;
}