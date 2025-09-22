import { Schema, Document, model } from "mongoose";
import { Comment, CommentStatus } from "../../domain/entities/Comment";


export interface CommentDocument extends Comment, Document {}

const CommentSchema = new Schema<CommentDocument>(
  {
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["original", "edited"] as CommentStatus[],
      default: "original",
    },
  },
  { timestamps: true }
);

export const CommentModel = model<CommentDocument>("Comment", CommentSchema);
