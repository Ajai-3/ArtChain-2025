import { Schema, model, Document } from 'mongoose';
import { Conversation, ConversationType } from '../../domain/entities/Conversation';

export interface IConversationDocument extends Document {
  type: ConversationType;
  memberIds: string[];
  ownerId?: string;
  adminIds: string[];
  name?: string;
  locked: boolean;
}

const ConversationSchema = new Schema<IConversationDocument>({
  type: { type: String, enum: ['PRIVATE', 'REQUEST', 'GROUP'] as ConversationType[], required: true },
  memberIds: { type: [String], required: true },
  ownerId: { type: String },
  adminIds: { type: [String], default: [] },
  name: { type: String },
  locked: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const ConversationModel = model<IConversationDocument>('Conversation', ConversationSchema);
