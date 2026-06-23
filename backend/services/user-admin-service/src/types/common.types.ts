import { SafeUser } from '../domain/entities/User';

export interface UserWithStats extends SafeUser {
  artworksCount?: number;
  auctionsCount?: number;
  commissionsCount?: number;
  supportersCount?: number;
}

export interface DashboardStats {
  topArts: Array<{
    id: string;
    title: string;
    imageUrl: string;
    likesCount: number;
    price: number;
    userId: string;
    previewUrl?: string | undefined;
    artist: {
      name: string;
      username: string;
      profileImage?: string | undefined;
    };
  }>;
  categoryStats: CategoryStatsItem[];
  recentAuctions: Array<{
    id: string;
    title: string;
    imageUrl: string;
    currentBid: number;
    endTime: Date;
    hostId: string;
    imageKey?: string;
    host: {
      name: string;
      username: string;
      profileImage?: string | undefined;
    };
    startPrice: number;
  }>;
  recentCommissions: Array<{
    id: string;
    amount: number;
    status: string;
    artistName: string;
    artistUsername?: string;
    artistProfileImage?: string | null;
    clientName: string;
    clientUsername?: string;
    clientProfileImage?: string | null;
    requestMessage: string;
    createdAt: string;
  }>;
  recentTransactions: Array<{
    id?: string;
    amount: number;
    category: string;
    description: string;
    createdAt: Date;
    userId?: string | undefined;
    user?: {
      username: string;
      name: string;
      profileImage?: string | undefined;
    } | null;
  }>;
  userCounts: {
    total: number;
    users: number;
    artists: number;
    banned: number;
  };
  artworkCounts: {
    total: number;
    free: number;
    premium: number;
    aiGenerated: number;
  };
  auctionCounts: {
    active: number;
    ended: number;
    sold: number;
    unsold: number;
  };
  commissionCounts: {
    REQUESTED?: number;
    AGREED?: number;
    IN_PROGRESS?: number;
    COMPLETED?: number;
    CANCELLED?: number;
    active?: number;
    ended?: number;
    sold?: number;
    unsold?: number;
  };
  transactionStats: {
    totalAmount: number;
    transactionCount: number;
    byCategory: Record<string, number>;
  };
}

export interface CategoryStatsItem {
  category: string;
  count: number;
}

export interface TopArtItem {
  id: string;
  title: string;
  imageUrl: string;
  likesCount: number;
  price: number;
  userId: string;
  artistName?: string;
}

export interface RecentAuctionItem {
  id: string;
  title: string;
  imageUrl: string;
  currentBid: number;
  endTime: Date;
  hostId: string;
  hostName?: string;
}

export interface RecentCommissionItem {
  id: string;
  title: string;
  imageUrl: string;
  status: string;
  requesterId: string;
  requesterName?: string;
  artistId: string;
  artistName?: string;
}

export interface RecentTransactionItem {
  id: string;
  amount: number;
  category: string;
  description: string;
  createdAt: Date;
  userId: string;
  userName?: string;
}

export interface PlatformRevenueStats {
  totalRevenue: number;
  period: string;
  chartData: RevenueChartItem[];
}

export interface RevenueChartItem {
  date: string;
  amount: number;
}

export interface ArtistRequestWithUser {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  createdAt: Date;
  reviewedAt: Date | null;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    profileImage: string | null;
  };
}

export interface UserListItem {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string | null;
  role: 'user' | 'admin' | 'artist';
  status: 'active' | 'banned' | 'suspended' | 'deleted';
  createdAt: Date;
}

export interface GroupedReport {
  targetId: string;
  targetType: string;
  reports: ReportItem[];
  reporters: ReporterItem[];
  commonReason?: string;
}

export interface ReportItem {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: Date;
}

export interface ReporterItem {
  id: string;
  name: string;
  username: string;
  profileImage: string | null;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface EmailTokenPayload {
  name: string;
  email: string;
  username: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface GetUsersResponse {
  meta: { page: number; limit: number; total: number };
  data: UserListItem[];
  stats?: {
    total: number;
    active: number;
    banned: number;
    artists: number;
  };
}

export interface GetArtistRequestsResponse {
  meta: { page: number; limit: number; total: number };
  data: ArtistRequestWithUser[];
}

export interface ApproveRejectResult {
  success: boolean;
  message: string;
}

export interface UpdateProfileResult {
  success: boolean;
  message: string;
}

export interface VerifyEmailTokenResult {
  success: boolean;
  message: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  bannerImage: string;
  status: 'active' | 'banned' | 'suspended' | 'deleted';
  isVerified: boolean;
  role: 'user' | 'admin' | 'artist';
  plan: 'free' | 'pro' | 'pro_plus';
  supportersCount: number;
  supportingCount: number;
  isSupporting: boolean;
}

export interface SupportResult {
  success: boolean;
  message: string;
}

export interface ChangeEmailResult {
  success: boolean;
  message: string;
}

export interface GetUsersResponse {
  meta: { page: number; limit: number; total: number };
  data: UserListItem[];
  stats?: { total: number; active: number; banned: number; artists: number };
}

export interface ApproveArtistResult {
  user: SafeUser | null;
  request: void;
}

export interface ArtistRequestResponse {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  createdAt: Date;
  reviewedAt: Date | null;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    profileImage: string | null;
  };
}