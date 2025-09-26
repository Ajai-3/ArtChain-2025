import { Schema, Document, model } from "mongoose";

export interface LikeDocument extends Document {
  postId: string; 
  userId: string;
}

const LikeSchema = new Schema<LikeDocument>(
  {
    postId: { type: String, required: true }, 
    userId: { type: String, required: true }, 
  },
  { timestamps: true }
);

LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const LikeModel = model<LikeDocument>("Like", LikeSchema);
