import app from './app';
import http from 'http';
import { startEmailConsumer } from './consumers/email.consumer';
import { config } from './config/env';

const PORT = config.port

const server = http.createServer(app);


startEmailConsumer()

server.listen(PORT, () => {
  console.log(`Notification Service is running on port ${PORT}`);
});