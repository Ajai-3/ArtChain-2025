import Redis from "ioredis";
import { config } from "./env";
import { logger } from "../../utils/logger";

export let redisPub: Redis;
export let redisSub: Redis;

export const connectRedis = async () => {
  if (!config.redis_url) {
      logger.warn("Redis URL not found in config, skipping Redis connection for Socket.IO");
      return;
  }
  redisPub = new Redis(config.redis_url);
  redisSub = new Redis(config.redis_url);
  
  await Promise.all([
    new Promise<void>((resolve) => redisPub.once("ready", () => resolve())),
    new Promise<void>((resolve) => redisSub.once("ready", () => resolve())),
  ]);
  logger.info("Redis connected for Socket.IO");
};
