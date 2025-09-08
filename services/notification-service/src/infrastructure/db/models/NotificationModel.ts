import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDoc extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  type: string;
  data: any;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const NotificationModel = mongoose.model<NotificationDoc>(
  "Notification",
  NotificationSchema,
  "notifications" 
);