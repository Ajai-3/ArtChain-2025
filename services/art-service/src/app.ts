import express from "express";

import artRouter from "./presentation/routes/art.routes";
import { logger } from "./utils/logger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  logger.info(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});

app.use("/api/v1/art", artRouter);

export default app;
