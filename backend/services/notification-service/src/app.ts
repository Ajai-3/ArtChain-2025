import express from 'express';
import { ROUTES } from './constants/routes';
import { logger } from './infrastructure/utils/logger';
import notificationRoutes from './presentation/routes/notification.routes';

const app = express();

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  logger.info(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});


app.use(ROUTES.BASE, notificationRoutes);

export default app;