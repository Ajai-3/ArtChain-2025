import express from 'express';
import 'reflect-metadata';
import { logger } from './utils/logger';
import cookieParser from 'cookie-parser';
import { createErrorHandler } from 'art-chain-shared';

import authRouter from './presentation/routes/user/auth.routes';
import userRouter from './presentation/routes/user/user.routes';
import adminRouter from './presentation/routes/admin/admin.routes';
import { ROUTES } from './constants/routes';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  logger.info(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});


app.use(ROUTES.API.AUTH, authRouter);
app.use(ROUTES.API.USER, userRouter);
app.use(ROUTES.API.ADMIN, adminRouter);

app.use(createErrorHandler(false));

export default app;