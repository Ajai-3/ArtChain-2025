export interface SendMessageDto {
  content: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
}