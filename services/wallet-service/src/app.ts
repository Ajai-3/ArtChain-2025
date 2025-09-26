import express from "express";
import { logger } from "./utils/logger";
import cookieParser from 'cookie-parser';
import { createErrorHandler } from 'art-chain-shared';

import walletRouter from "./presentation/routes/wallet.routes"

const app = express();

app.use(cookieParser());
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/wallet/stripe/webhook") {
    next(); // skip JSON parsing for webhook
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

app.use("/api/v1/wallet", walletRouter)

app.use(createErrorHandler(false));

export default app;