import mongoose, { Schema, Document, model } from "mongoose";
import { ArtPost } from "../../domain/entities/ArtPost";

export interface ArtPostDocument extends ArtPost, Document {}

const ArtPostSchema = new Schema<ArtPostDocument>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  artType: { type: String, required: true },
  hashtags: { type: [String], default: [] },
  previewUrl: { type: String, required: true },
  watermarkedUrl: { type: String, required: true },
  aspectRatio: { type: String, required: true },
  commentingDisabled: { type: Boolean, default: false },
  downloadingDisabled: { type: Boolean, default: false },
  isPrivate: { type: Boolean, default: false },
  isSensitive: { type: Boolean, default: false },
  supporterOnly: { type: Boolean, default: false },
  isForSale: { type: Boolean, default: false },
  priceType: { type: String },
  artcoins: { type: Number },
  fiatPrice: { type: Number },
  postType: { type: String, default: "original" },
  originalPostId: { type: String },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const ArtPostModel = model<ArtPostDocument>("ArtPost", ArtPostSchema);
