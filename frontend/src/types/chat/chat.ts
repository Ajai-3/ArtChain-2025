// types/chat.ts
export const ConversationType = {
  PRIVATE: "PRIVATE",
  GROUP: "GROUP",
} as const;

export type ConversationType =
  (typeof ConversationType)[keyof typeof ConversationType];

export const MediaType = {
  IMAGE: "IMAGE",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];

export const DeleteMode = {
  NONE: "NONE",
  ME: "ME",
  ALL: "ALL",
} as const;

export type DeleteMode = (typeof DeleteMode)[keyof typeof DeleteMode];

export interface User {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  memberIds: string[];
  ownerId?: string;
  adminIds?: string[];
  name?: string;
  description?: string;
  members?: User[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
  lastSeen?: string;
  locked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  mediaType?: MediaType;
  mediaUrl?: string;
  readBy?: string[];
  deleteMode: DeleteMode;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
