export interface LikeEventPayload {
  userId: string;
  senderId: string;
  senderName: string;
  senderProfile: string | null;
  createdAt: string;
}

export interface GiftEventPayload {
  receiverId: string;
  senderId: string;
  amount: number;
  message?: string;
  senderName?: string;
  senderImage?: string;
}

export interface SupportEventPayload {
  userId: string;
  senderId: string;
  senderName: string;
  senderProfile: string | null;
  createdAt: string;
}