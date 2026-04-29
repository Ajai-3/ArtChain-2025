export interface WalletData {
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
