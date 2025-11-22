export interface ICacheService {
  set(key: string, value: string, expiryInMS?: number): Promise<boolean>;
  del(key: string): Promise<number>;
  llen(key: string): Promise<number>;
  get(key: string): Promise<string | null>;
  rpush(key: string, ...values: string[]): Promise<number>;
  ltrim(key: string, start: number, stop: number): Promise<string>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
}