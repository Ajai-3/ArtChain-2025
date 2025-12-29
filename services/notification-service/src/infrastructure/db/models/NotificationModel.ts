import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDoc extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  senderId: string;
  type: string;
  read: boolean;
  metadata: any;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  senderId: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export const NotificationModel = mongoose.model<NotificationDoc>(
  "Notification",
  NotificationSchema,
  "notifications" 
);