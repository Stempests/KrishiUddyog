import mongoose from 'mongoose';
import { logger } from '../utils/logger';

const MONGODB_URI = process.env.MONGODB_URI as string;

export const connectDB = async (): Promise<void> => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ MongoDB reconnected');
});
