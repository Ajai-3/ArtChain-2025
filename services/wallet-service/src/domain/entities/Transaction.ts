export type TransactionType = "credited" | "debited";
export type TransactionMethod = "stripe" | "razorpay";
export type TransactionStatus = "pending" | "success" | "failed";
export type TransactionCategory =
  | "TOP_UP"
  | "SALE"
  | "PURCHASE"
  | "WITHDRAWAL"
  | "COMMISSION"
  | "REFUND"
  | "OTHER";

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly walletId: string,
    public readonly type: TransactionType,
    public readonly category: TransactionCategory,
    public readonly amount: number,
    public readonly method: TransactionMethod,
    public readonly status: TransactionStatus = "pending",
    public readonly externalId?: string | null,
    public readonly description?: string,
    public readonly meta?: any,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}
