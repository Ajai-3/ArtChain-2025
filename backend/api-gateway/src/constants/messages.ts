export const RATE_LIMIT_MESSAGES = {
  TOO_MANY_REQUESTS: 'Too many requests from this IP, please try again after 15 minutes',
  REDIS_ERROR: 'Redis Client Error in Rate Limiter',
  REDIS_CONNECTED: 'Connected to Redis for Rate Limiting',
  REDIS_FALLBACK: 'Failed to connect to Redis for Rate Limiting, falling back to memory store',
  LIMIT_EXCEEDED: (ip: string) => `Rate limit exceeded for IP: ${ip}`,
};
