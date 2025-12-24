import { Schema, Document, model } from "mongoose";
import { Category, CategoryStatus } from "../../domain/entities/Category";

export interface CategoryDocument extends Category, Document {}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive"] as CategoryStatus[],
      default: "active",
    },
  },
  { timestamps: true }
);

export const CategoryModel = model<CategoryDocument>(
  "Category",
  CategorySchema
);
