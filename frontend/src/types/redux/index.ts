import type { User } from "../users/user/user";
import type { Auction, Bid } from "../auction";
import type { Conversation, Message } from "../chat/chat";
import type { Notification } from "../notification/notification";

export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  artWorkCount: number;
  supportingCount: number;
  supportersCount: number;
}

export interface AdminState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
}

export interface BiddingState {
  activeAuctionId: string | null;
  activeAuction: Auction | null;
  bids: Bid[];
  currentHighestBid: number;
  loading: boolean;
  error: string | null;
  auctions: Auction[];
}

export interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  recentConversations: Conversation[];
  loading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
}

export interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
  loading: boolean;
}

export interface WalletTransaction {
  id: string;
  amount: number;
  type: "CREDIT" | "DEBIT";
  status: "PENDING" | "SUCCESS" | "FAILED";
  description: string;
  createdAt: string;
}

export interface PlatformState {
  config: PlatformConfig | null;
  loading: boolean;
}

export interface PlatformConfig {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
}

export interface RootState {
  user: UserState;
  admin: AdminState;
  bidding: BiddingState;
  chat: ChatState;
  notification: NotificationState;
  wallet: WalletState;
  platform: PlatformState;
}