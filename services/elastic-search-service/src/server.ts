import app from './app';
import { config } from './config/env';
import { startUserConsumer } from './consumers/user.consumer';

const PORT = config.port;

startUserConsumer()

app.listen(PORT, () => {
  console.log(`Elastic User Service running on port ${PORT}`);
});
