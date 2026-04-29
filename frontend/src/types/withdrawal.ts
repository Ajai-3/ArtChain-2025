export interface WithdrawalData {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'REJECTED'
    | 'FAILED';
  method: 'BANK_TRANSFER' | 'UPI';

  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;

  upiId?: string;

  rejectionReason?: string;

  createdAt: string;
  updatedAt: string;
  user?: {
    name?: string;
    username?: string;
    email?: string;
    profileImage?: string | null;
  };
}

export interface WithdrawalListResponse {
  data: {
    withdrawals: WithdrawalData[];
    total: number;
  };
  page: number;
  limit: number;
  nextPage: number | null;
  hasNextPage: boolean;
}
