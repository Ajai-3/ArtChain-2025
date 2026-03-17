import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import { config } from './infrastructure/config/env';
import { logger } from './infrastructure/utils/logger';
import { initSockets } from './infrastructure/sockets';
import { connectDB } from './infrastructure/config/db';
import { startAllConsumers } from './infrastructure/messaging/consumers';

const PORT = config.port;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: config.frontend_url },
});

connectDB();
initSockets(io);

startAllConsumers();

server.listen(PORT, () => {
  logger.info(`Notification Service is running on port ${PORT}`);
});
