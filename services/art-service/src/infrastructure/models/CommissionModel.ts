import { Schema, model } from "mongoose";
import { Commission, CommissionStatus } from "../../domain/entities/Commission";

export interface ICommissionDocument extends Omit<Commission, "_id"> {
  _id: string;
}

const CommissionSchema = new Schema<ICommissionDocument>(
  {
    requesterId: { type: String, required: true, index: true },
    artistId: { type: String, required: true, index: true },
    conversationId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    referenceImages: { type: [String], default: [] },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(CommissionStatus),
      default: CommissionStatus.REQUESTED,
      index: true,
    },
    amount: { type: Number },
    platformFee: { type: Number },
    lastUpdatedBy: { type: String },
    finalArtwork: { type: String },
    deliveryDate: { type: Date },
    autoReleaseDate: { type: Date },
    platformFeePercentage: { type: Number },
    disputeReason: { type: String },
    history: [
      {
        action: { type: String, required: true },
        userId: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        details: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CommissionModel = model<ICommissionDocument>(
  "Commission",
  CommissionSchema
);
