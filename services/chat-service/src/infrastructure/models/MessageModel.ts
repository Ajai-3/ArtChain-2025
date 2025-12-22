import { Schema, model } from "mongoose";
import { Message, MediaType, DeleteMode, CallStatus } from "../../domain/entities/Message";

export interface IMessageDocument extends Omit<Message, "id"> {}

const MessageSchema = new Schema<IMessageDocument>(
  {
    conversationId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ["TEXT", "IMAGE", "AUDIO", "VIDEO", "CALL_LOG"] as MediaType[],
      required: true,
    },
    mediaUrl: { type: String },
    readBy: { type: [String], default: [] },
    deleteMode: {
      type: String,
      enum: ["NONE", "ME", "ALL"] as DeleteMode[],
      default: "NONE",
    },
    callId: { type: String },
    callStatus: {
      type: String,
      enum: ["MISSED", "ENDED", "STARTED", "DECLINED"] as CallStatus[],
    },
    callDuration: { type: Number },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model<IMessageDocument>("Message", MessageSchema);
