import { Router } from 'express';
import { container } from '../../infrastructure/Inversify/inversify.config';
import { TYPES } from '../../infrastructure/Inversify/types';
import { IAuctionController } from '../interface/IAuctionController';
import { IBidController } from '../interface/IBidController';
import { ROUTES } from '../../constants/routes';

const router = Router();

const auctionController = container.get<IAuctionController>(TYPES.IAuctionController);
const bidController = container.get<IBidController>(TYPES.IBidController);

// Auction Routes
router.post(ROUTES.AUCTION.BASE, auctionController.createAuction);
router.get(ROUTES.AUCTION.COUNTS, auctionController.getAuctionAlertCounts);
router.get(ROUTES.AUCTION.BASE, auctionController.getAuctions);
router.get(ROUTES.AUCTION.BY_ID, auctionController.getAuction);

// Bid Routes
router.post(ROUTES.AUCTION.PLACE_BID, bidController.placeBid);
router.get(ROUTES.AUCTION.BIDS, bidController.getBids);
router.get(ROUTES.AUCTION.USER_BIDS, bidController.getUserBids);
router.get(ROUTES.AUCTION.USER_BIDDING_HISTORY, auctionController.getUserBiddingHistory);



export default router;
