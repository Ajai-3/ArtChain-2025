import http from 'http';
import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';

const PORT = config.port;

const server = http.createServer(app);


server.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

