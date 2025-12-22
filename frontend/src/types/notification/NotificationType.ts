export const NotificationType = {
  LIKE: 'LIKE',
  SUPPORT: 'SUPPORT',
  GIFT_RECEIVED: 'GIFT_RECEIVED',
  FOLLOW: 'FOLLOW'
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];
