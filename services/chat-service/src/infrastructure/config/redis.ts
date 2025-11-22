import Redis from "ioredis";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export let redisPub: Redis;
export let redisSub: Redis;
export let redisCache: Redis;

export const connectRedis = async () => {
  redisPub = new Redis(env.redis_url);
  redisSub = new Redis(env.redis_url);
  redisCache = new Redis(env.redis_url);

  await Promise.all([
    new Promise<void>((resolve) => redisPub.once("ready", () => resolve())),
    new Promise<void>((resolve) => redisSub.once("ready", () => resolve())),
    new Promise<void>((resolve) => redisCache.once("ready", () => resolve())),
  ]);

  logger.info("🐛 Redis connected.");
};
