import { injectable } from "inversify";
import { redisCache } from "../config/redis";
import { ICacheService } from "../../domain/service/ICacheService";

@injectable()
export class RedisCacheService implements ICacheService {
  async set(key: string, value: string, expiryInMS?: number): Promise<boolean> {
    if (expiryInMS) {
      return (await redisCache.set(key, value, "PX", expiryInMS)) === "OK";
    }
    return (await redisCache.set(key, value)) === "OK";
  }

  async get(key: string): Promise<string | null> {
    return await redisCache.get(key);
  }

  async del(key: string): Promise<number> {
    return await redisCache.del(key);
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    return await redisCache.rpush(key, ...values);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await redisCache.lrange(key, start, stop);
  }

  async ltrim(key: string, start: number, stop: number): Promise<string> {
    return await redisCache.ltrim(key, start, stop);
  }

  async llen(key: string): Promise<number> {
    return await redisCache.llen(key);
  }
}
