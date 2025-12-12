import mongoose, { Schema, Document, model } from "mongoose";
import { Auction, AuctionStatus } from "../../domain/entities/Auction";

export interface AuctionDocument extends Omit<Auction, '_id'>, Document {}

const AuctionSchema = new Schema<AuctionDocument>(
  {
    hostId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    imageKey: { type: String, required: true },
    startPrice: { type: Number, required: true },
    currentBid: { type: Number, default: 0 },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ["SCHEDULED", "ACTIVE", "ENDED", "CANCELLED"] as AuctionStatus[], 
      default: "SCHEDULED" 
    },
    winnerId: { type: String, default: null },
    bids: [{ type: Schema.Types.ObjectId, ref: 'Bid' }]
  },
  { timestamps: true }
);

export const AuctionModel = model<AuctionDocument>("Auction", AuctionSchema);
