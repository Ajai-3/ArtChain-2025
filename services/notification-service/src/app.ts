import express from "express";
import notificationRoutes from "./presentation/routes/notification.routes"
import { logger } from "./infrastructure/utils/logger";

const app = express()

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  logger.info(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});


app.use("/api/v1/notifications", notificationRoutes)

export default app;