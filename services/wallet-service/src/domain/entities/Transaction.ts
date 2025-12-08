export const TransactionType = {
  CREDITED: "credited",
  DEBITED: "debited",
} as const;
export type TransactionType = typeof TransactionType[keyof typeof TransactionType];

export const TransactionMethod = {
  STRIPE: "stripe",
  RAZORPAY: "razorpay",
  ART_COIN: "art_coin",
} as const;
export type TransactionMethod = typeof TransactionMethod[keyof typeof TransactionMethod];

export const TransactionStatus = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
} as const;
export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export const TransactionCategory = {
  TOP_UP: "TOP_UP",
  SALE: "SALE",
  PURCHASE: "PURCHASE",
  WITHDRAWAL: "WITHDRAWAL",
  COMMISSION: "COMMISSION",
  REFUND: "REFUND",
  OTHER: "OTHER",
} as const;
export type TransactionCategory = typeof TransactionCategory[keyof typeof TransactionCategory];

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly walletId: string,
    public readonly type: TransactionType,
    public readonly category: TransactionCategory,
    public readonly amount: number,
    public readonly method: TransactionMethod,
    public readonly status: TransactionStatus = TransactionStatus.PENDING,
    public readonly externalId?: string | null,
    public readonly description?: string,
    public readonly meta?: any,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}
