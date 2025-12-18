export const CommissionStatus = {
  REQUESTED: "REQUESTED",
  NEGOTIATING: "NEGOTIATING",
  AGREED: "AGREED",
  LOCKED: "LOCKED",
  IN_PROGRESS: "IN_PROGRESS",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  DISPUTE_RAISED: "DISPUTE_RAISED",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED",
} as const;

export type CommissionStatus =
  (typeof CommissionStatus)[keyof typeof CommissionStatus];

export interface CommissionHistory {
  action: string;
  userId: string;
  timestamp: Date;
  details?: string;
}

export class Commission {
  constructor(
    public readonly _id: string,
    public readonly requesterId: string,
    public readonly artistId: string,
    public readonly conversationId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly budget: number,
    public readonly deadline: Date,
    public readonly status: CommissionStatus,
    public readonly referenceImages: string[] = [],
    public readonly history: CommissionHistory[] = [],
    public readonly lastUpdatedBy?: string, 
    public readonly amount?: number, 
    public readonly platformFee?: number,
    public readonly finalArtwork?: string,
    public readonly deliveryDate?: Date,
    public readonly autoReleaseDate?: Date,
    public readonly disputeReason?: string,
    public readonly platformFeePercentage?: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
