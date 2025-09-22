import mongoose, { Schema, Document, model } from "mongoose";
import { ArtPost, PriceType, PostType, PostStatus } from "../../domain/entities/ArtPost";

export interface ArtPostDocument extends ArtPost, Document {}

const ArtPostSchema = new Schema<ArtPostDocument>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    artName: { type: String, unique: true, required: true },
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
    isForSale: { type: Boolean, default: false },

    priceType: { type: String, enum: ["artcoin", "fiat"] as PriceType[] },
    artcoins: { type: Number },
    fiatPrice: { type: Number },

    postType: { type: String, enum: ["original", "repost", "purchased"] as PostType[], default: "original" },
    originalPostId: { type: String },
    status: { type: String, enum: ["active", "archived", "deleted"] as PostStatus[], default: "active" },
  },
  { timestamps: true }
);

export const ArtPostModel = model<ArtPostDocument>("ArtPost", ArtPostSchema);
