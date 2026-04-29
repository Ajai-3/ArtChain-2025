import type { User } from '../users/user/user';

export interface Transaction {
  id: string;
  amount: number;
  type: 'credited' | 'debited';
  category: string;
  status: string;
  createdAt: string;
}
export interface WalletData {
  id: string;
  user: User;
  lastTransaction?: Transaction;
  status: 'active' | 'locked' | 'suspended';
  balance: number;
  lockedAmount: number;
  updatedAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  method: string;
  status: string;
  accountHolderName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
  upiId?: string | null;
  transactionId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWithdrawalResponse {
  message: string;
  withdrawalRequest: WithdrawalRequest;
  wallet: WalletData;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface StripeSessionResponse {
  sessionId: string;
}
