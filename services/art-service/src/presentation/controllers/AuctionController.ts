import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { IAuctionController } from "../interface/IAuctionController";
import { TYPES } from "../../infrastructure/Inversify/types";
import { ICreateAuctionUseCase } from "../../application/interface/usecase/auction/ICreateAuctionUseCase";
import { IGetAuctionsUseCase } from "../../application/interface/usecase/auction/IGetAuctionsUseCase";
import { IGetAuctionByIdUseCase } from "../../application/interface/usecase/auction/IGetAuctionByIdUseCase";

@injectable()
export class AuctionController implements IAuctionController {
  constructor(
    @inject(TYPES.ICreateAuctionUseCase) private createAuctionUseCase: ICreateAuctionUseCase,
    @inject(TYPES.IGetAuctionsUseCase) private getAuctionsUseCase: IGetAuctionsUseCase,
    @inject(TYPES.IGetAuctionByIdUseCase) private getAuctionByIdUseCase: IGetAuctionByIdUseCase
  ) {}

    async createAuction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const hostId = req.headers["x-user-id"] as string;
        const auction = await this.createAuctionUseCase.execute({ ...req.body, hostId });
        res.status(201).json(auction);
    } catch (error) {
        next(error);
    }
  }

  async getAuctions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const auctions = await this.getAuctionsUseCase.execute(page, limit);
        res.status(200).json(auctions);
    } catch (error) {
        next(error);
    }
  }

  async getAuction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const id = req.params.id;
        const auction = await this.getAuctionByIdUseCase.execute(id);
        if (!auction) {
             res.status(404).json({ message: "Auction not found" });
             return;
        }
        res.status(200).json(auction);
    } catch (error) {
        next(error);
    }
  }
}
