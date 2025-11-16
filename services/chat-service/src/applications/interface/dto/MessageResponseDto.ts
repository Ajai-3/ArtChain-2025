export interface UserDto {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
}
export interface MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: UserDto;
  content: string | null;
  mediaType: string | null;
  mediaUrl: string | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}
