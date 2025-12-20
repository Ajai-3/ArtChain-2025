import mongoose, { Schema, Document, model } from "mongoose";
import { Purchase } from "../../domain/entities/Purchase";

export interface PurchaseDocument extends Purchase, Document {}

const PurchaseSchema = new Schema<PurchaseDocument>(
  {
    userId: { type: String, required: true, index: true }, // Buyer
    artId: { type: String, required: true, index: true },
    sellerId: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index for unique purchase per user per art (optional but good for data integrity)
PurchaseSchema.index({ userId: 1, artId: 1 }, { unique: true });

export const PurchaseModel = model<PurchaseDocument>("Purchase", PurchaseSchema);
