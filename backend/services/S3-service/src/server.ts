import http from 'http';
import app from './app';
import { config } from './infrastructure/config/env';
import { logger } from './infrastructure/utils/logger';

const PORT = config.port;

const server = http.createServer(app);

server.listen(PORT, () => {
    logger.info(`Upload service running in port ${PORT}`);
});