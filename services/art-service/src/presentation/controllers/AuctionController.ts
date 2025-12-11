import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { HttpStatus } from "art-chain-shared";
import { logger } from "../../utils/logger";
import { IAuctionController } from "../interface/IAuctionController";
import { TYPES } from "../../infrastructure/Inversify/types";
import { ICreateAuctionUseCase } from "../../application/interface/usecase/auction/ICreateAuctionUseCase";
import { IGetAuctionsUseCase } from "../../application/interface/usecase/auction/IGetAuctionsUseCase";
import { IGetAuctionByIdUseCase } from "../../application/interface/usecase/auction/IGetAuctionByIdUseCase";
import { AUCTION_MESSAGES } from "../../constants/AuctionMessages";

import { createAuctionSchema } from "../validators/auction.schema";
import { CreateAuctionDTO } from "../../application/interface/dto/auction/CreateAuctionDTO";

@injectable()
export class AuctionController implements IAuctionController {
  constructor(
    @inject(TYPES.ICreateAuctionUseCase)
    private readonly _createAuctionUseCase: ICreateAuctionUseCase,
    @inject(TYPES.IGetAuctionsUseCase)
    private readonly _getAuctionsUseCase: IGetAuctionsUseCase,
    @inject(TYPES.IGetAuctionByIdUseCase)
    private readonly _getAuctionByIdUseCase: IGetAuctionByIdUseCase
  ) {}

  //# ================================================================================================================
  //# CREATE AUCTION
  //# ================================================================================================================
  //# POST /api/v1/art/auctions
  //# Headers: x-user-id
  //# Body: title, description, startPrice, startTime, imageKey
  //# This controller creates a new auction.
  //# ================================================================================================================
  createAuction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const hostId = req.headers["x-user-id"] as string;
      logger.info(`Creating auction for host: ${hostId}`);

      const validatedBody = createAuctionSchema.parse(req.body);
      
      const dto: CreateAuctionDTO = {
        hostId,
        title: validatedBody.title,
        description: validatedBody.description,
        startPrice: validatedBody.startPrice,
        startTime: validatedBody.startTime,
        endTime: validatedBody.endTime,
        imageKey: validatedBody.imageKey
      };

      const auction = await this._createAuctionUseCase.execute(dto);

      return res.status(HttpStatus.CREATED).json({
        message: AUCTION_MESSAGES.AUCTION_CREATED,
        data: auction,
      });
    } catch (error) {
      logger.error("Error in createAuction", error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET AUCTIONS
  //# ================================================================================================================
  //# GET /api/v1/art/auctions
  //# Query: page, limit, status, startDate, endDate
  //# This controller fetches auctions with filtering options.
  //# ================================================================================================================
  getAuctions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (req.query.startDate) {
        startDate = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        endDate = new Date(req.query.endDate as string);
      }

      logger.info(
        `Fetching auctions page=${page} limit=${limit} status=${status}`
      );

      const auctions = await this._getAuctionsUseCase.execute(
        page,
        limit,
        status,
        startDate,
        endDate
      );

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.AUCTIONS_FETCHED,
        data: auctions,
      });
    } catch (error) {
      logger.error("Error in getAuctions", error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET AUCTION BY ID
  //# ================================================================================================================
  //# GET /api/v1/art/auctions/:id
  //# Params: id
  //# This controller fetches a single auction by ID.
  //# ================================================================================================================
  getAuction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const id = req.params.id;
      logger.info(`Fetching auction by id=${id}`);

      const auction = await this._getAuctionByIdUseCase.execute(id);

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.AUCTION_FETCHED,
        data: auction,
      });
    } catch (error) {
      logger.error("Error in getAuction", error);
      next(error);
    }
  };
}
