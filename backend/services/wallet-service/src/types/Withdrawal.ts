import { WithdrawalRequest, WithdrawalMethod, WithdrawalStatus } from '../domain/entities/WithdrawalRequest';

export interface WithdrawalUserInfo {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string | null;
}

export interface WithdrawalRequestWithUser extends Omit<WithdrawalRequest, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
  user: WithdrawalUserInfo | null;
}

export interface WithdrawalStatusCounts {
  PENDING?: number;
  APPROVED?: number;
  PROCESSING?: number;
  COMPLETED?: number;
  REJECTED?: number;
  FAILED?: number;
  [key: string]: number | undefined;
}

export interface GetAllWithdrawalsResponse {
  withdrawalRequests: WithdrawalRequestWithUser[];
  total: number;
  totalCount: number;
  statusCounts: WithdrawalStatusCounts;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateWithdrawalResponse {
  withdrawalRequest: WithdrawalRequest;
  wallet: {
    id: string;
    userId: string;
    balance: number;
    lockedAmount: number;
    status: 'active' | 'locked' | 'suspended';
  };
}