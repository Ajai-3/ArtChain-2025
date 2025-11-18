import { Schema, model } from "mongoose";
import { Message, MediaType, DeleteMode } from "../../domain/entities/Message";

export interface IMessageDocument extends Omit<Message, "id"> {}

const MessageSchema = new Schema<IMessageDocument>(
  {
    conversationId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ["TEXT", "IMAGE", "AUDIO", "VIDEO"] as MediaType[],
      required: true,
    },
    mediaUrl: { type: String },
    readBy: { type: [String], default: [] },
    deleteMode: {
      type: String,
      enum: ["NONE", "ME", "ALL"] as DeleteMode[],
      default: "NONE",
    },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model<IMessageDocument>("Message", MessageSchema);
