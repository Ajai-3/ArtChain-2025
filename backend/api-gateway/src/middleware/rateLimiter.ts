import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';
import { config } from '../config/env';
import { logger } from '../utils/logger';

let store;

if (config.redis_url) {
  const client = createClient({
    url: config.redis_url,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
    },
  });

  client.on('error', (err) => logger.error('Redis Client Error in Rate Limiter', err));
  client.on('connect', () => logger.info('Connected to Redis for Rate Limiting'));

  try {
    await client.connect();
    store = new RedisStore({
      // @ts-ignore
      sendCommand: (...args: string[]) => client.sendCommand(args),
    });
  } catch (err) {
    logger.error('Failed to connect to Redis for Rate Limiting, falling back to memory store', err);
  }
}

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 150, 
  standardHeaders: true,
  legacyHeaders: false,
  store: store, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  },
});
