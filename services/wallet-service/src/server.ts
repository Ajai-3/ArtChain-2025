import http from "http";
import app from "./app";
import { logger } from "./utils/logger";
import { config } from "./infrastructure/config/env";
import { startConsumers } from "./infrastructure/rabbitmq/consumer";

const PORT = config.port;

const server = http.createServer(app)

await startConsumers()

server.listen(PORT, () => {
    logger.info(`Wallet Service starts on port ${PORT}`)
})