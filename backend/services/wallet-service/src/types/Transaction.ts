export interface TransactionMeta {
  withdrawalMethod?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
  recipientId?: string;
  senderId?: string;
  withdrawalId?: string;
  originalTransactionId?: string;
  [key: string]: unknown;
}

export interface TransactionSummaryItem {
  id: string;
  walletId: string;
  type: 'credited' | 'debited';
  category: 'TOP_UP' | 'SALE' | 'PURCHASE' | 'WITHDRAWAL' | 'COMMISSION' | 'REFUND' | 'GIFT' | 'AUCTION_FEE' | 'SALE_FEE' | 'COMMISSION_FEE' | 'OTHER';
  amount: number;
  method: 'stripe' | 'razorpay' | 'art_coin';
  status: 'pending' | 'success' | 'failed';
  externalId?: string | null;
  description?: string;
  meta?: TransactionMeta | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionResponse {
  transactions: TransactionSummaryItem[];
  total: number;
  page: number;
  limit: number;
}