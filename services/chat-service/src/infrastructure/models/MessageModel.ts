import { Schema, model } from "mongoose";
import { Message, MediaType } from "../../domain/entities/Message";

export interface IMessageDocument extends Omit<Message, "id"> {}

const MessageSchema = new Schema<IMessageDocument>(
  {
    conversationId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ["IMAGE", "AUDIO", "VIDEO"] as MediaType[],
      required: true,
    },
    mediaUrl: { type: String },
    readBy: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedFor: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model<IMessageDocument>("Message", MessageSchema);