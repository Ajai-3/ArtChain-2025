export interface ICacheService {
  set(key: string, value: string, expiryInMS?: number): Promise<boolean>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;
  rpush(key: string, ...values: string[]): Promise<number>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  ltrim(key: string, start: number, stop: number): Promise<string>;
}