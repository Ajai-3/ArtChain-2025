import { NotificationType } from './NotificationType';

export interface NotificationMetadata {
  amount?: number;
  message?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface Notification {
  id: string;
  userId: string;
  senderId: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  senderName?: string;
  senderImage?: string;
  metadata?: NotificationMetadata;
}
