import express from "express";
import elasticUserRoutes from "./routes/userElastic.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log(`Incoming request: ${req.method} ${fullUrl}`);
  next();
});

app.use("/api/v1/elastic-user", elasticUserRoutes);

app.use(errorHandler);

export default app;
