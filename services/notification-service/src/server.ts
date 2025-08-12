import app from './app';
import http from 'http';
import { startEmailConsumer } from './consumers/email.consumer';

const PORT = process.env.PORT

const server = http.createServer(app);


startEmailConsumer()

server.listen(PORT, () => {
  console.log(`Notification Service is running on port ${PORT}`);
});