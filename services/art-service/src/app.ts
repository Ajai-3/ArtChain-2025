import express from "express";
import { createErrorHandler } from "art-chain-shared";

import artRouter from "./presentation/routes/art.routes";
import { logger } from "./utils/logger";
import { ROUTES } from "./constants/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  logger.info(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});

app.use(ROUTES.BASE, artRouter);

app.use(createErrorHandler(false))

export default app;
