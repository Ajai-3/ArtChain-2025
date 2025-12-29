import { NotificationType } from './NotificationType';

export interface Notification {
  id: string;
  userId: string;
  senderId: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  senderName?: string;
  senderImage?: string;
  metadata?: {
    amount?: number;
    message?: string;
    [key: string]: any;
  };
}
