import { logger } from '../../utils/logger';
import { ILogger } from '../../application/interface/ILogger';

export class AppLogger implements ILogger {
  info(message: string, meta?: any): void {
    logger.info(message, meta);
  }

  warn(message: string, meta?: any): void {
    logger.warn(message, meta);
  }

  error(message: string, meta?: any): void {
    logger.error(message, meta);
  }
}
