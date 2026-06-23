import type { JsonValue } from '../../types/json';

export interface ILogger {
  info(message: string, meta?: JsonValue): void;
  warn(message: string, meta?: JsonValue): void;
  debug(message: string, meta?: JsonValue): void;
  error(message: string, meta?: JsonValue): void;
}