import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { IBidController } from "../interface/IBidController";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IPlaceBidUseCase } from "../../application/interface/usecase/bid/IPlaceBidUseCase";
import { IGetBidsUseCase } from "../../application/interface/usecase/bid/IGetBidsUseCase";

@injectable()
export class BidController implements IBidController {
  constructor(
    @inject(TYPES.IPlaceBidUseCase) private placeBidUseCase: IPlaceBidUseCase,
    @inject(TYPES.IGetBidsUseCase) private getBidsUseCase: IGetBidsUseCase
  ) {}

  async placeBid(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const bidderId = req.headers["x-user-id"] as string;
        const { auctionId, amount } = req.body;
        const bid = await this.placeBidUseCase.execute(auctionId, bidderId, amount);
        res.status(201).json(bid);
    } catch (error) {
        next(error);
    }
  }

  async getBids(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const auctionId = req.params.auctionId;
        const bids = await this.getBidsUseCase.execute(auctionId);
        res.status(200).json(bids);
    } catch (error) {
        next(error);
    }
  }
}
