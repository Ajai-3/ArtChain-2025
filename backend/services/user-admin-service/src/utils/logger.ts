import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';
import { config } from '../infrastructure/config/env';

const { combine, timestamp, printf, colorize, json } = format;
const serviceName = 'user-admin-service';

const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${serviceName}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  defaultMeta: { service: serviceName },
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat),
    }),

    new LokiTransport({
      host: config.loki.host,
      basicAuth: `${config.loki.user}:${config.loki.token}`,
      labels: { service: serviceName },
      json: true,
      batching: false,
      gracefulShutdown: true,
      timeout: 10000,
      onConnectionError: (err) => console.error('LOKI CONNECTION ERROR:', err),
    }),
  ],
});
