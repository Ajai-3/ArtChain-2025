import { rateLimit, Store } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { RATE_LIMIT_MESSAGES } from '../constants/messages';

let store: Store | undefined;

if (config.redis_url) {
  const client = createClient({
    url: config.redis_url,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
    },
  });

  client.on('error', (err) => logger.error(RATE_LIMIT_MESSAGES.REDIS_ERROR, err));
  client.on('connect', () => logger.info(RATE_LIMIT_MESSAGES.REDIS_CONNECTED));

  try {
    await client.connect();
    store = new RedisStore({
      // @ts-ignore
      sendCommand: (...args: string[]) => client.sendCommand(args),
    });
  } catch (err) {
    const error = err as Error;
    logger.error(RATE_LIMIT_MESSAGES.REDIS_FALLBACK, error);
  }
}

export const globalRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 450,
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
  message: {
    success: false,
    message: RATE_LIMIT_MESSAGES.TOO_MANY_REQUESTS,
  },
  handler: (req, res, next, options) => {
    logger.warn(RATE_LIMIT_MESSAGES.LIMIT_EXCEEDED(req.ip || 'unknown'));
    res.status(options.statusCode).json(options.message);
  },
});
