import app from './app';
import http from 'http';
import { config } from './config/env';
import { startAllConsumers } from './consumers';

const PORT = config.port

const server = http.createServer(app);


startAllConsumers()

server.listen(PORT, () => {
  console.log(`Notification Service is running on port ${PORT}`);
});