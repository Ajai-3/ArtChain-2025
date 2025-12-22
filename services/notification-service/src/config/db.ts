import { config } from "../constants/env";
import mongoose from "mongoose";
import { logger } from "../infrastructure/utils/logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongo_url);
    logger.info("✅ Connected to MongoDB Atlas");
  } catch (error) {
    logger.error("❌ Database connection error", error);
    process.exit(1);
  }
};
