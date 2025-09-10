import mongoose, { Schema, Document, model } from "mongoose";
import { Comment } from "../../domain/entities/Comment";

export interface CommentDocument extends Comment, Document {}

const CommentSchema = new Schema<CommentDocument>({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, default: "active" },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const CommentModel = model<CommentDocument>("Comment", CommentSchema);