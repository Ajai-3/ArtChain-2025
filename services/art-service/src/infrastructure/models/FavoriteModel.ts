import { Schema, Document, model } from "mongoose";

export interface FavoriteDocument extends Document {
  postId: string; 
  userId: string;
}

const FavoriteSchema = new Schema<FavoriteDocument>(
  {
    postId: { type: String, required: true }, 
    userId: { type: String, required: true }, 
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const FavoriteModel = model<FavoriteDocument>("Favorite", FavoriteSchema);
