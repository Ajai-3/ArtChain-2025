export type AuctionStatus = "SCHEDULED" | "ACTIVE" | "ENDED" | "CANCELLED";

export class Auction {
  constructor(
    public readonly hostId: string,
    public readonly title: string,
    public readonly description: string | undefined, // Changed null to undefined for compatibility if needed, or keep string
    public readonly imageKey: string,
    public readonly startPrice: number,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly currentBid: number = 0,
    public readonly status: AuctionStatus = "SCHEDULED",
    public readonly winnerId: string | null = null,
    public readonly bids: string[] = [], // Array of Bid IDs
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly _id?: string
  ) {}
}
