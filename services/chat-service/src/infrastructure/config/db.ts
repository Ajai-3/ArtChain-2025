import { env } from './env';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongo_uri);
    logger.info('✅ MongoDB connected');
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};