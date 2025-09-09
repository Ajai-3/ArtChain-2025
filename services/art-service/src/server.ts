import http from "http";
import app from "./app";
import { logger } from "./utils/logger";
import { config } from "./infrastructure/config/env";

const PORT = config.port;

const server = http.createServer(app)

server.listen(PORT, () => {
    logger.info(`Art Service starts on port ${PORT}`)
})