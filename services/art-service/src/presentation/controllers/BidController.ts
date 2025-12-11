import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { HttpStatus } from "art-chain-shared";
import { logger } from "../../utils/logger";
import { IBidController } from "../interface/IBidController";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IPlaceBidUseCase } from "../../application/interface/usecase/bid/IPlaceBidUseCase";
import { IGetBidsUseCase } from "../../application/interface/usecase/bid/IGetBidsUseCase";
import { IGetUserBidsUseCase } from "../../application/interface/usecase/bid/IGetUserBidsUseCase";
import { AUCTION_MESSAGES } from "../../constants/AuctionMessages";

import { placeBidSchema } from "../validators/bid.schema";
import { PlaceBidDTO } from "../../application/interface/dto/bid/PlaceBidDTO";

@injectable()
export class BidController implements IBidController {
  constructor(
    @inject(TYPES.IPlaceBidUseCase)
    private readonly _placeBidUseCase: IPlaceBidUseCase,
    @inject(TYPES.IGetBidsUseCase)
    private readonly _getBidsUseCase: IGetBidsUseCase,
    @inject(TYPES.IGetUserBidsUseCase)
    private readonly _getUserBidsUseCase: IGetUserBidsUseCase
  ) {}

  //# ================================================================================================================
  //# PLACE BID
  //# ================================================================================================================
  //# POST /api/v1/art/bids
  //# Headers: x-user-id
  //# Body: auctionId, amount
  //# This controller handles placing a bid on an auction.
  //# ================================================================================================================
  placeBid = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const bidderId = req.headers["x-user-id"] as string;
      
      const validatedBody = placeBidSchema.parse(req.body);

      logger.info(
        `Placing bid on auction ${validatedBody.auctionId} by user ${bidderId} amount ${validatedBody.amount}`
      );

      const dto: PlaceBidDTO = {
        auctionId: validatedBody.auctionId,
        amount: validatedBody.amount,
        bidderId
      };

      const bid = await this._placeBidUseCase.execute(dto);

      return res.status(HttpStatus.CREATED).json({
        message: AUCTION_MESSAGES.BID_PLACED,
        data: bid,
      });
    } catch (error) {
      logger.error("Error in placeBid", error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET BIDS
  //# ================================================================================================================
  //# GET /api/v1/art/bids/:auctionId
  //# Params: auctionId
  //# This controller fetches all bids for a specific auction.
  //# ================================================================================================================
  getBids = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const auctionId = req.params.auctionId;
      logger.info(`Fetching bids for auctionId=${auctionId}`);

      const bids = await this._getBidsUseCase.execute(auctionId);

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.BIDS_FETCHED,
        data: bids,
      });
    } catch (error) {
      logger.error("Error in getBids", error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET USER BIDS
  //# ================================================================================================================
  //# GET /api/v1/art/my-bids
  //# Headers: x-user-id
  //# This controller fetches the bid history for the current user.
  //# ================================================================================================================
  getUserBids = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      logger.info(`Fetching bid history for userId=${userId}`);

      const bids = await this._getUserBidsUseCase.execute(userId);

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.USER_BIDS_FETCHED,
        data: bids,
      });
    } catch (error) {
      logger.error("Error in getUserBids", error);
      next(error);
    }
  };
}
