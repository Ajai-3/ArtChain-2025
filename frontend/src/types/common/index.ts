export interface ApiError {
  status: number;
  statusCode?: number;
  message: string;
  isNetworkError?: boolean;
  fullError?: unknown;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  fullError?: unknown;
}

export interface QueueItem<T = unknown> {
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

export interface QueueItemNullable<T = string | null> {
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

export type ErrorCallback = (error: ApiError) => void;

export type SuccessCallback<T = unknown> = (data: T) => void;

export type InvalidationCallback = (errors: Record<string, unknown>) => void;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface UserBasicInfo {
  id: string;
  username: string;
  name?: string;
  profileImage?: string;
  isVerified?: boolean;
  role?: string;
}

export type AuctionStatus = "SCHEDULED" | "ACTIVE" | "ENDED" | "CANCELLED" | "UNSOLD";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "NONE";

export type WebRTCSignalType = "offer" | "answer" | "ice-candidate";

export interface WebRTCSignal {
  type: WebRTCSignalType;
  sdp?: string;
  candidate?: RTCIceCandidateInit;
  fromUserId: string;
  toUserId: string;
  callId: string;
}

export interface CallData {
  callId: string;
  callerId: string;
  calleeId: string;
  callerName: string;
  callerProfileImage?: string;
  type: "audio" | "video";
  isGroupCall?: boolean;
}

export interface SocketEventData {
  conversationId: string;
  userId: string;
  messageIds?: string[];
  readBy?: string[];
}

export interface TypingEventData {
  conversationId: string;
  userId: string;
}

export interface NewConversationData {
  conversation: unknown;
  participants?: string[];
}

export interface BidEventData {
  auctionId: string;
  bid: unknown;
}

export interface AuctionEndEventData {
  auctionId: string;
  status: AuctionStatus;
  winnerId?: string;
  winningBidAmount?: number;
}