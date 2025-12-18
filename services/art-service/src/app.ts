import express from "express";
import { createErrorHandler } from "art-chain-shared";

import artRouter from "./presentation/routes/art.routes";
import aiRouter from "./presentation/routes/ai.routes";
import adminAIRouter from "./presentation/routes/admin-ai.routes";
import adminArtRouter from "./presentation/routes/admin-art.routes";
import adminAuctionRouter from "./presentation/routes/admin-auction.routes";
import biddingRouter from "./presentation/routes/bidding.routes";
import commissionRouter from "./presentation/routes/commission.routes";
import adminCommissionRouter from "./presentation/routes/admin-commission.routes";
import adminConfigRouter from "./presentation/routes/admin-config.routes";
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

app.use(ROUTES.BASE, biddingRouter);

app.use(ROUTES.BASE, artRouter);
app.use(ROUTES.BASE, aiRouter);
app.use(ROUTES.BASE, adminAIRouter);
app.use(ROUTES.BASE, adminArtRouter);
app.use(ROUTES.BASE, adminAuctionRouter);

app.use(ROUTES.BASE, adminConfigRouter);
app.use(ROUTES.BASE, adminCommissionRouter);
app.use(ROUTES.BASE + "/commission", commissionRouter);

app.use(createErrorHandler(false))

export default app;
