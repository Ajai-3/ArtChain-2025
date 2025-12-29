import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../redux/store';

export interface TopArt {
  id: string;
  title: string;
  artistName: string;
  price: number;
  likes: number;
  image: string;
  artist?: {
    id: string;
    username: string;
    name: string;
    profileImage: string | null;
  };
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface RecentAuction {
  id: string;
  title: string;
  currentBid: number;
  startPrice: number;
  status: string;
  endTime: string;
  image: string;
  imageKey?: string;
}

export interface RecentCommission {
  id: string;
  artistName: string;
  clientName: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface RecentTransaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  date: string;
  description: string;
}

export interface UserCounts {
  total: number;
  users: number;
  artists: number;
  banned: number;
}

export interface ArtworkCounts {
  total: number;
  free: number;
  premium: number;
  aiGenerated: number;
}

export interface AuctionCounts {
  active: number;
  ended: number;
  unsold: number;
  sold: number;
}

export interface DashboardStats {
  topArts: TopArt[];
  categoryStats: CategoryStat[];
  recentAuctions: RecentAuction[];
  recentCommissions: RecentCommission[];
  recentTransactions: RecentTransaction[];
  userCounts: UserCounts;
  artworkCounts: ArtworkCounts;
  auctionCounts: AuctionCounts;
  commissionCounts: CommissionCounts;
  transactionStats: TransactionVolume[];
}

export interface CommissionCounts {
  REQUESTED: number;
  AGREED: number;
  IN_PROGRESS: number;
  COMPLETED: number;
}

export interface TransactionVolume {
    date: string;
    earned: number;
    spent: number;
}

export const useDashboardStats = () => {
  const { admin } = useSelector((state: RootState) => state.admin);

  const { data: stats, isLoading: loading, error, refetch } = useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard-stats'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>(
        '/api/v1/admin/dashboard-stats'
      );
      return response.data.data;
    },
    enabled: !!admin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    stats: stats || null,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};
