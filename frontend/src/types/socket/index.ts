import type { Message } from "../chat/chat";

export interface TypingEventPayload {
  userId: string;
  conversationId: string;
}

export interface MessagesReadPayload {
  conversationId: string;
  messageIds: string[];
  readBy: string[];
}

export interface NewConversationPayload {
  id: string;
  type: "PRIVATE" | "GROUP";
  memberIds: string[];
  ownerId?: string;
  adminIds?: string[];
  locked: boolean;
  name?: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message | null;
  unreadCount: number;
  partner?: {
    id: string;
    name: string;
    username: string;
    plan?: string;
    role?: string;
    profileImage?: string | null;
  } | null;
  group?: {
    name: string;
    profileImage?: string | null;
    conversationId: string;
  } | null;
}

export interface BidPlacedPayload {
  id: string;
  amount: number;
  bidderId: string;
  createdAt: string;
  bidder?: {
    id: string;
    username: string;
    profileImage?: string;
    isVerified?: boolean;
    role?: string;
  };
}

export interface AuctionEndedPayload {
  auctionId: string;
  status: "SCHEDULED" | "ACTIVE" | "ENDED" | "CANCELLED" | "UNSOLD";
  winnerId?: string;
  winningBidAmount?: number;
}

export interface IncomingCallPayload {
  callId: string;
  conversationId: string;
  callerId: string;
  callerName: string;
  callerProfileImage?: string;
  isGroup: boolean;
  type: "audio" | "video";
}

export interface CallSignalPayload {
  signal: RTCSessionDescriptionInit | RTCIceCandidateInit | CallControlSignal;
  from: string;
  to: string;
  callId: string;
}

export interface CallControlSignal {
  type: "camera-toggle" | "mic-toggle";
  enabled: boolean;
}

export interface CallAcceptedPayload {
  callId: string;
  conversationId: string;
}

export interface CallRejectedPayload {
  callId: string;
  conversationId: string;
  reason?: string;
}

export interface CallEndedPayload {
  callId: string;
  conversationId: string;
  duration?: number;
}

export interface CallInitiatePayload {
  receiverId: string;
  callId: string;
  callerId: string;
  callerName: string;
  callerProfileImage?: string;
  conversationId: string;
  isGroup: boolean;
  type: "audio" | "video";
}

export interface CallErrorPayload {
  callId: string;
  conversationId: string;
  error: string;
}