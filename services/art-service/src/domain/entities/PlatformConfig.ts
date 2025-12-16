export class PlatformConfig {
  constructor(
    public readonly auctionCommissionPercentage: number,
    public readonly artSaleCommissionPercentage: number,
    public readonly welcomeBonus: number,
    public readonly referralBonus: number,
    public readonly artCoinRate: number,
    public readonly updatedAt?: Date,
    public readonly _id?: string
  ) {}
}
