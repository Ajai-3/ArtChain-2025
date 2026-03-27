import app from './app';
import { config } from './config/env';
import { startUserConsumer } from './consumers/user.consumer';
import { logger } from './utils/logger';

const PORT = config.port;

startUserConsumer();

app.listen(PORT, () => {
  logger.info(`Elastic User Service running on port ${PORT}`);
});
