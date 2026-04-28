export interface QuickStats {
  earned: number;
  spent: number;
}

export interface TransactionSummary {
  earned: number;
  spent: number;
  netGain: number;
}

export interface WalletQuickStats {
  quickStats: QuickStats;
  transactionSummary: TransactionSummary;
}

export interface WalletResponse {
  id: string;
  userId: string;
  balance: number;
  lockedAmount: number;
  status: 'active' | 'locked' | 'suspended';
  quickStats: QuickStats;
  transactionSummary: TransactionSummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletSummaryResponse {
  balance: number;
  inrValue: number;
  lockedAmount: number;
}