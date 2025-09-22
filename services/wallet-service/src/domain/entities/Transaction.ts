export class Transaction {
  constructor(
    public readonly id: string,
    public readonly walletId: string,
    public readonly type: "credited" | "debited",
    public readonly amount: number,
    public readonly method: "stripe" | "razorpay", 
    public readonly description?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}
