import { logger } from '../../utils/logger';
import { ILogger } from '../../application/interface/ILogger';

export class AppLogger implements ILogger {
  info(message: string, meta?: unknown): void {
    logger.info(message, meta);
  }

  warn(message: string, meta?: unknown): void {
    logger.warn(message, meta);
  }

  debug(message: string, meta?: unknown): void {
    logger.debug(message, meta);
  }

  error(message: string, meta?: unknown): void {
    logger.error(message, meta);
  }
}
