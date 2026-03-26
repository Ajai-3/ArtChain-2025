import { createLogger, format, transports } from 'winston';
import LokiTransport from 'winston-loki';
import { config } from '../config/env';

const { combine, timestamp, printf, colorize, json } = format;
const serviceName = 'notification-service';

const consoleFormat = printf(({ level, message, timestamp }) => {
  const time = new Date(timestamp as string).toLocaleString();
  return `${time} [${serviceName}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: 'silly',
  format: combine(timestamp(), json()),
  defaultMeta: { service: serviceName },
  transports: [
    new transports.Console({
      level: 'silly',
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
