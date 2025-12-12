import { Router } from "express";
import { container } from "../../infrastructure/Inversify/inversify.config";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAuctionController } from "../interface/IAuctionController";
import { IBidController } from "../interface/IBidController";
import { ROUTES } from "../../constants/routes";

const router = Router();

const auctionController = container.get<IAuctionController>(TYPES.IAuctionController);
const bidController = container.get<IBidController>(TYPES.IBidController);

// Auction Routes
router.post(ROUTES.AUCTION.BASE, (req, res, next) => auctionController.createAuction(req, res, next));
router.get(ROUTES.AUCTION.BASE, (req, res, next) => auctionController.getAuctions(req, res, next));
router.get(ROUTES.AUCTION.BY_ID, (req, res, next) => auctionController.getAuction(req, res, next));

// Bid Routes
router.post(ROUTES.AUCTION.PLACE_BID, (req, res, next) => bidController.placeBid(req, res, next));
router.get(ROUTES.AUCTION.BIDS, (req, res, next) => bidController.getBids(req, res, next));
router.get(ROUTES.AUCTION.USER_BIDS, (req, res, next) => bidController.getUserBids(req, res, next));

export default router;
