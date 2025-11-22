import http from "http";
import app from "./app";
import { env } from "./infrastructure/config/env";
import { initSocket } from "./infrastructure/socket";
import { logger } from "./infrastructure/utils/logger";
import { connectDB } from "./infrastructure/config/db";
import { connectRedis } from "./infrastructure/config/redis";

const server = http.createServer(app);

await connectDB();
await connectRedis();

initSocket(server);

server.listen(env.port, () => {
  logger.info(`🐦‍🔥 Chat service started on port ${env.port}`);
});