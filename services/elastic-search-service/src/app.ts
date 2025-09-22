import express from "express";
import elasticSearchRoutes from "./routes/userElastic.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";
import { logger } from "./utils/logger";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  logger.info(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});

app.use("/api/v1/elastic", elasticSearchRoutes);

app.use(errorHandler);

export default app;
