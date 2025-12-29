import { Router } from "express";
import { container } from "../../infrastructure/Inversify/inversify.config";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAuctionController } from "../interface/IAuctionController";
import { ROUTES } from "../../constants/routes";

const adminAuctionRouter = Router();

const auctionController = container.get<IAuctionController>(TYPES.IAuctionController);

adminAuctionRouter.get(ROUTES.ADMIN_AUCTION.BASE, (req, res, next) => auctionController.getAuctionsWithStats(req, res, next));
adminAuctionRouter.get(ROUTES.ADMIN_AUCTION.STATS, (req, res, next) => auctionController.getAuctionStats(req, res, next));
adminAuctionRouter.get(ROUTES.ADMIN_AUCTION.RECENT, (req, res, next) => auctionController.getRecentAuctions(req, res, next));
adminAuctionRouter.get(ROUTES.ADMIN_AUCTION.BY_ID, (req, res, next) => auctionController.getAuction(req, res, next));
adminAuctionRouter.patch(ROUTES.ADMIN_AUCTION.CANCEL, (req, res, next) => auctionController.cancelAuction(req, res, next));

export default adminAuctionRouter;
