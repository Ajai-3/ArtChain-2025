import { Schema, model } from "mongoose";
import { Conversation, ConversationType } from "../../domain/entities/Conversation";

export interface IConversationDocument extends Omit<Conversation, "id"> {}

const ConversationSchema = new Schema<IConversationDocument>({
  type: { type: String, enum: ["PRIVATE", "GROUP"] as ConversationType[], required: true },
  memberIds: { type: [String], required: true },
  name: { type: String },
  locked: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const ConversationModel = model<IConversationDocument>("Conversation", ConversationSchema);
