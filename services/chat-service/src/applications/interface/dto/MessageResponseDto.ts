export interface MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  mediaType: string | null;
  mediaUrl: string | null;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
