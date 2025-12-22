import mongoose, { Schema, Document } from "mongoose";

export interface AIGenerationDocument extends Document {
  userId: string;
  prompt: string;
  negativePrompt?: string;
  resolution: string;
  imageCount: number;
  seed?: number;
  images: string[];
  provider: string;
  aiModel: string;
  cost: number;
  isFree: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generationTime?: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AIGenerationSchema = new Schema<AIGenerationDocument>(
  {
    userId: { type: String, required: true, index: true },
    prompt: { type: String, required: true },
    negativePrompt: { type: String },
    resolution: { type: String, required: true },
    imageCount: { type: Number, required: true },
    seed: { type: Number },
    images: { type: [String], required: true },
    provider: { type: String, required: true },
    aiModel: { type: String, required: true },
    cost: { type: Number, required: true, default: 0 },
    isFree: { type: Boolean, required: true, default: true },
    status: { 
      type: String, 
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    generationTime: { type: Number },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for quota checking
AIGenerationSchema.index({ userId: 1, isFree: 1, createdAt: 1 });

export const AIGenerationModel = mongoose.model<AIGenerationDocument>(
  "AIGeneration",
  AIGenerationSchema
);
