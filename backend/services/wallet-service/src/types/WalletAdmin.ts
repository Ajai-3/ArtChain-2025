export interface WalletStats {
  total: number;
  active: number;
  suspended: number;
  locked: number;
}

export interface WalletMeta {
  total: number;
  page: number;
  limit: number;
}

export interface UserBasicInfo {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string | null;
}

export interface WalletWithUser {
  id: string;
  userId: string;
  balance: number;
  lockedAmount: number;
  status: 'active' | 'locked' | 'suspended';
  quickStats: Record<string, number> | null;
  transactionSummary: Record<string, number> | null;
  createdAt: Date;
  updatedAt: Date;
  user: UserBasicInfo;
}

export interface GetAllWalletsResponse {
  data: WalletWithUser[];
  meta: WalletMeta;
  stats?: WalletStats;
}