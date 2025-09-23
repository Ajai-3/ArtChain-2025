export type TransactionType = "credited" | "debited";
export type Method = "stripe" | "razorpay";
export type TransactionStatus = "pending" | "success" | "failed";

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly walletId: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly method: Method,
    public readonly status: TransactionStatus = "pending",
    public readonly externalId?: string,
    public readonly description?: string,
    public readonly meta?: any,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}
