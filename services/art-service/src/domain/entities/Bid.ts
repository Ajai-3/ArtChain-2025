export class Bid {
  constructor(
    public readonly auctionId: string,
    public readonly bidderId: string,
    public readonly amount: number,
    public readonly createdAt?: Date,
    public readonly _id?: string,
    public readonly isWinner: boolean = false
  ) {}
}
