import cors from 'cors';
import express from 'express';
import { config } from './config/env';
import cookieParser from 'cookie-parser';
import mainRoutes from './routes/main.route';
import { conditionalAuth } from './middleware/conditionalAuth';
import { logger } from './utils/logger';
import { globalRateLimiter } from './middleware/rateLimiter';

const app = express();

app.use(
  cors({
    origin: config.frontend_url,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Origin',
      'x-user-id',
      'X-Requested-With',
    ],
    credentials: true,
  })
);

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`);
  next();
});

app.use(globalRateLimiter);
app.use(cookieParser());

app.use(conditionalAuth);

app.use('/', mainRoutes);

export default app;