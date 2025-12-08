export class Wallet {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly balance: number = 0,
    public readonly lockedAmount: number = 0,
    public readonly status: 'active' | 'locked' | 'suspended' ,
    public readonly quickStats: any = {},
    public readonly transactionSummary: any = {},
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}
