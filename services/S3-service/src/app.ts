import express from "express";

const app = express();

import uploadRoutes from "./presentation/routes/upload.routes";
import { errorHandler } from "./presentation/middleware/errorHandler";
import { logger } from "./infrastructure/utils/logger";
import { ROUTES } from "./constants/routes";

app.use((req, res, next) => {
  console.log(req.headers["x-user-id"])
  logger.info(`Incoming request: ${req.method} ${req.path} ${req.file}`);
  next();
});

app.use(express.json());

app.use(ROUTES.UPLOAD_BASE, uploadRoutes);

app.use(errorHandler);

export default app;
