import mongoose, { Schema, Document } from "mongoose";

export interface PlatformConfigDocument extends Document {
  auctionCommissionPercentage: number;
  artSaleCommissionPercentage: number;
  commissionArtPercentage: number;
  welcomeBonus: number;
  referralBonus: number;
  artCoinRate: number;
  updatedAt: Date;
}

const PlatformConfigSchema = new Schema<PlatformConfigDocument>(
  {
    auctionCommissionPercentage: { type: Number, default: 2.5 },
    artSaleCommissionPercentage: { type: Number, default: 5.0 },
    commissionArtPercentage: { type: Number, default: 5.0 },
    welcomeBonus: { type: Number, default: 100 },
    referralBonus: { type: Number, default: 50 },
    artCoinRate: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export const PlatformConfigModel = mongoose.model<PlatformConfigDocument>(
  "PlatformConfig",
  PlatformConfigSchema
);
