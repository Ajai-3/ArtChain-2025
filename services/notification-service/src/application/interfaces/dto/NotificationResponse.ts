export interface NotificationResponse {
  id?: string;
  userId: string;
  senderId: string;
  type: string;
  read: boolean;
  createdAt: Date;
  senderName?: string;
  senderImage?: string;
}
