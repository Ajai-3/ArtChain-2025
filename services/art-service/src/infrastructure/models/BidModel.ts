import mongoose, { Schema, Document, model } from "mongoose";
import { Bid } from "../../domain/entities/Bid";

export interface BidDocument extends Omit<Bid, '_id'>, Document {
  isWinner: boolean;
}

const BidSchema = new Schema<BidDocument>(
  {
    auctionId: { type: String, ref: 'Auction', required: true },
    bidderId: { type: String, required: true },
    amount: { type: Number, required: true },
    isWinner: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BidModel = model<BidDocument>("Bid", BidSchema);
