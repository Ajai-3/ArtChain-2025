import express from "express";
import { logger } from "./utils/logger";
import cookieParser from 'cookie-parser';
import { createErrorHandler } from 'art-chain-shared';

import adminRouter from "./presentation/routes/admin.routes";
import walletRouter from "./presentation/routes/wallet.routes"
import { ROUTES } from "./constants/routes";

const app = express();

app.use(cookieParser());
app.use((req, res, next) => {
  if (req.originalUrl === ROUTES.FULL.STRIPE_WEBHOOK) {
    next(); 
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  logger.info(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});


app.use(ROUTES.BASE.WALLET, walletRouter);
app.use(ROUTES.BASE.WALLET, adminRouter);

app.use(createErrorHandler(false));

export default app;