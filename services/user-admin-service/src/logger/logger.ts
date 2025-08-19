import { createLogger, format, transports } from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";
import { Client } from "@elastic/elasticsearch";

const { combine, timestamp, printf, json, colorize } = format;
const serviceName = "user-admin-service";

const consoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${serviceName}] ${level}: ${message}`;
});

const esTransport = new ElasticsearchTransport({
  level: "info",
  clientOpts: { node: "http://localhost:9200" },
  indexPrefix: `service-${serviceName}-logs`,
  transformer: (log) => ({
    "@timestamp": log.timestamp,
    severity: log.level,
    message: log.message,
    service: serviceName,
    ...log.meta,
  }),
});

export const logger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat),
    }),
    new transports.File({ filename: `logs/${serviceName}-combined.log` }),
    new transports.File({
      filename: `logs/${serviceName}-error.log`,
      level: "error",
    }),
    esTransport,
  ],
});

const elasticClient = new Client({ node: "http://localhost:9200" });

export const storeUserInfo = async (user: {
  userId: string;
  name: string;
  username: string;
  email: string;
}) => {
  await elasticClient.index({
    index: "users",
    document: { ...user, service: serviceName, createdAt: new Date() },
  });
};

// import { createLogger, format, transports } from 'winston';
// const { combine, timestamp, printf, json, colorize } = format;

// const consoleFormat = printf(({ level, message, timestamp, service }) => {
//   return `${timestamp} [${service}] ${level}: ${message}`;
// });

// export const logger = createLogger({
//   level: 'info',
//   format: combine(
//     timestamp(),
//     json()
//   ),
//   defaultMeta: { service: 'api-gateway' },
//   transports: [
//     new transports.Console({
//       format: combine(
//         colorize(),
//         timestamp(),
//         consoleFormat
//       )
//     }),
//     new transports.File({ filename: 'logs/error.log', level: 'error' }),
//     new transports.File({ filename: 'logs/combined.log' })
//   ]
// });
