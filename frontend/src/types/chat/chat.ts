// types/chat.ts

export const ConversationType = {
  PRIVATE: "PRIVATE",
  GROUP: "GROUP",
  REQUEST: "REQUEST", // added based on your backend logic
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
  plan?: string;
  role?: string;
  profileImage?: string | null;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  mediaType?: MediaType;
  mediaUrl?: string;
  readBy: string[];
  deleteMode: DeleteMode;
  deletedAt?: Date | null;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  memberIds: string[];
  ownerId?: string;
  adminIds?: string[];
  locked: boolean;
  name?: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message | null;
  unreadCount: number;
  partner?: User | null; 
  group?: { name: string } | null;
}

export interface PaginatedConversations {
  conversations: Conversation[];
  page: number;
  limit: number;
  nextPage: number | null;
  hasNextPage: boolean;
  total: number;
}
