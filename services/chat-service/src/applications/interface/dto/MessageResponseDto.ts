export interface UserDto {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  plan?: string;
  role?: string;
  status?: string;
}
export interface MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: UserDto;
  readBy: string[];
  content: string | null;
  mediaType: string | null;
  mediaUrl: string | null;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  callId?: string;
  callStatus?: string;
  callDuration?: number;
}
