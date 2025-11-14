import http from "http";
import app from "./app";
import { env } from "./infrastructure/config/env";
import { logger } from "./infrastructure/utils/logger";
import { connectDB } from "./infrastructure/config/db";

const server = http.createServer(app);

await connectDB();

server.listen(env.port, () => {
  logger.info(`🐦‍🔥 Chat service started on port ${env.port}`);
});