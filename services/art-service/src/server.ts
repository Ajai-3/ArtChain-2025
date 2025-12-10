import http from "http";
import app from "./app";
import { logger } from "./utils/logger";
import { config } from "./infrastructure/config/env";
import { connectDB } from "./infrastructure/config/db";

import { container } from "./infrastructure/Inversify/inversify.config";
import { TYPES } from "./infrastructure/Inversify/types";
import { ISocketService } from "./domain/interfaces/ISocketService";
import { connectRedis } from "./infrastructure/config/redis";

const PORT = config.port;

const server = http.createServer(app)

connectDB().then(async () => {
    await connectRedis();
    const socketService = container.get<ISocketService>(TYPES.ISocketService);
    socketService.initialize(server);
    
    server.listen(PORT, () => {
        logger.info(`Art Service starts on port ${PORT}`)
    })
});