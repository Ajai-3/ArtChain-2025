export interface WithdrawalData {
  _id: string;
  id: string;
  userId: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  paymentMethod?: string;
  paymentDetails?: {
    upiId?: string;
    bankAccount?: string;
    ifscCode?: string;
  };
  createdAt: string;
  processedAt?: string;
  user?: {
    id: string;
    username: string;
    name?: string;
    profileImage?: string;
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