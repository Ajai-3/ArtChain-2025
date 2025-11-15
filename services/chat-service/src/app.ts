import express from 'express';
import chatRoutes from './presentation/routes/chat.routes';
import { logger } from './infrastructure/utils/logger';
import { createErrorHandler } from 'art-chain-shared';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  logger.info(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});

app.use('/api/v1/chat', chatRoutes);

app.use(createErrorHandler)

export default app;