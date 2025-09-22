import http from "http";
import app from "./app";
import { config } from "./infrastructure/config/env";
import { logger } from "./utils/logger";

const PORT = config.port;

const server = http.createServer(app)


server.listen(PORT, () => {
    logger.info(`Wallet Service starts on port ${PORT}`)
})