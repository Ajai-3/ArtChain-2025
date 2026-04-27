import { logger } from '../../utils/logger';
import { ILogger } from '../../application/interface/ILogger';
import type { JsonValue } from '../../types/json';

export class AppLogger implements ILogger {
  info(message: string, meta?: JsonValue): void {
    logger.info(message, meta);
  }

  warn(message: string, meta?: JsonValue): void {
    logger.warn(message, meta);
  }

  debug(message: string, meta?: JsonValue): void {
    logger.debug(message, meta);
  }

  error(message: string, meta?: JsonValue): void {
    logger.error(message, meta);
  }
}
