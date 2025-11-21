import express from 'express';
import chatRoutes from './presentation/routes/chat.routes';
import { logger } from './infrastructure/utils/logger';
import { createErrorHandler } from 'art-chain-shared';
import { ROUTES } from './constants/routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  logger.info(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});

app.use(ROUTES.API_V1_CHAT, chatRoutes);

app.use(createErrorHandler)

export default app;