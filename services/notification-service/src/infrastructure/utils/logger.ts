import { createLogger, format, transports } from "winston";
import LokiTransport from "winston-loki";

const { combine, timestamp, printf, colorize, json } = format;
const serviceName = "notification-service";

const consoleFormat = printf(({ level, message, timestamp }) => {
  const time = new Date(timestamp as string).toLocaleString();
  return `${time} [${serviceName}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: "silly",
  format: combine(timestamp(), json()),
  defaultMeta: { service: serviceName },
  transports: [
    new transports.Console({
      level: "silly",
      format: combine(colorize(), timestamp(), consoleFormat),
    }),

    new LokiTransport({
      host: "http://loki:3100",
      labels: { service: serviceName },
      json: true,
    }),
  ],
});
