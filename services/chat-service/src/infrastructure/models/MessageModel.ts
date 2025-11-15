import { Schema, model } from "mongoose";
import { Message, MessageType } from "../../domain/entities/Message";

export interface IMessageDocument extends Omit<Message, "id"> {}

const MessageSchema = new Schema<IMessageDocument>({
  conversationId: { type: String, required: true },
  senderId: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, enum: ["IMAGE", "AUDIO", "VIDEO"] as MessageType[], required: true },
  mediaUrl: { type: String },
  readBy: { type: [String], default: [] },
}, {
  timestamps: true,
});

export const MessageModel = model<IMessageDocument>("Message", MessageSchema);