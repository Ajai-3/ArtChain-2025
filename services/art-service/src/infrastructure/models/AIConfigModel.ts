import mongoose, { Schema, Document } from "mongoose";

export interface AIConfigDocument extends Document {
  provider: string;
  displayName: string;
  apiKey?: string;
  enabled: boolean;
  isFree: boolean;
  dailyFreeLimit: number;
  artcoinCostPerImage: number;
  defaultModel: string;
  availableModels: string[];
  maxPromptLength: number;
  allowedResolutions: string[];
  maxImageCount: number;
  defaultSteps: number;
  defaultGuidanceScale: number;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const AIConfigSchema = new Schema<AIConfigDocument>(
  {
    provider: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    apiKey: { type: String },
    enabled: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
    dailyFreeLimit: { type: Number, default: 5 },
    artcoinCostPerImage: { type: Number, default: 0 },
    defaultModel: { type: String, default: '' },
    availableModels: { type: [String], default: [] },
    maxPromptLength: { type: Number, default: 500 },
    allowedResolutions: { 
      type: [String], 
      default: ['512x512', '768x768', '1024x1024', '1152x896', '896x1152']
    },
    maxImageCount: { type: Number, default: 4 },
    defaultSteps: { type: Number, default: 30 },
    defaultGuidanceScale: { type: Number, default: 7.5 },
    priority: { type: Number, default: 99 }
  },
  { timestamps: true }
);

export const AIConfigModel = mongoose.model<AIConfigDocument>(
  "AIConfig",
  AIConfigSchema
);
