export interface SendMessageDto {
  id?: string;
  tempId?: string;
  content: string;
  senderId: string;
  receiverId?: string;
  conversationId: string;
  mediaType?: string;
}