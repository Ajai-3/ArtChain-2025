import { logger } from '../../utils/logger';
import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../infrastructure/Inversify/types';
import { validateWithZod } from '../../utils/validateWithZod';
import { createAuctionSchema } from '../validators/auction.schema';
import { AUCTION_MESSAGES } from '../../constants/AuctionMessages';
import { IAuctionController } from '../interface/IAuctionController';
import { GetAuctionsDTO } from '../../application/interface/dto/auction/GetAuctionsDTO';
import { CreateAuctionDTO } from '../../application/interface/dto/auction/CreateAuctionDTO';
import { GetAuctionByIdDTO } from '../../application/interface/dto/auction/GetAuctionByIdDTO';
import { IGetAuctionsUseCase } from '../../application/interface/usecase/auction/IGetAuctionsUseCase';
import { ICreateAuctionUseCase } from '../../application/interface/usecase/auction/ICreateAuctionUseCase';
import { ICancelAuctionUseCase } from '../../application/interface/usecase/auction/ICancelAuctionUseCase';
import { IGetAuctionByIdUseCase } from '../../application/interface/usecase/auction/IGetAuctionByIdUseCase';
import { IGetUserBiddingHistoryUseCase } from '../../application/interface/usecase/auction/IGetUserBiddingHistoryUseCase';
import { IGetAuctionStatsUseCase } from '../../application/interface/usecase/auction/IGetAuctionStatsUseCase';
import { IGetRecentAuctionsUseCase } from '../../application/interface/usecase/admin/IGetRecentAuctionsUseCase';
import { IEndAuctionUseCase } from '../../application/interface/usecase/auction/IEndAuctionUseCase';


@injectable()
export class AuctionController implements IAuctionController {
  constructor(
    @inject(TYPES.IGetUserBiddingHistoryUseCase)
    private readonly _getUserBiddingHistoryUseCase: IGetUserBiddingHistoryUseCase,
    @inject(TYPES.ICreateAuctionUseCase)
    private readonly _createAuctionUseCase: ICreateAuctionUseCase,
    @inject(TYPES.IGetAuctionsUseCase)
    private readonly _getAuctionsUseCase: IGetAuctionsUseCase,
    @inject(TYPES.IGetAuctionByIdUseCase)
    private readonly _getAuctionByIdUseCase: IGetAuctionByIdUseCase,
    @inject(TYPES.IGetAuctionStatsUseCase)
    private readonly _getAuctionStatsUseCase: IGetAuctionStatsUseCase,
    @inject(TYPES.ICancelAuctionUseCase)
    private readonly _cancelAuctionUseCase: ICancelAuctionUseCase,
    @inject(TYPES.IGetRecentAuctionsUseCase)
    private readonly _getRecentAuctionsUseCase: IGetRecentAuctionsUseCase,
    @inject(TYPES.IEndAuctionUseCase)
    private readonly _endAuctionUseCase: IEndAuctionUseCase
  ) { }

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
      const hostId = req.headers['x-user-id'] as string;
      logger.info(`Creating auction for host: ${hostId}`);

      const validatedBody = validateWithZod(createAuctionSchema, req.body);

      const dto: CreateAuctionDTO = {
        hostId,
        title: validatedBody.title,
        description: validatedBody.description,
        startPrice: validatedBody.startPrice,
        startTime: new Date(validatedBody.startTime),
        endTime: new Date(validatedBody.endTime),
        imageKey: validatedBody.imageKey
      };

      const auction = await this._createAuctionUseCase.execute(dto);

      return res.status(HttpStatus.CREATED).json({
        message: AUCTION_MESSAGES.AUCTION_CREATED,
        data: auction,
      });
    } catch (error) {
      logger.error('Error in createAuction', error);
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

      const dto: GetAuctionsDTO = {
        page,
        limit,
        filterStatus: status,
        startDate,
        endDate,
        hostId: req.query.hostId as string
      };

      const result = await this._getAuctionsUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.AUCTIONS_FETCHED,
        data: result,
      });
    } catch (error) {
      logger.error('Error in getAuctions', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET AUCTIONS WITH STATS (ADMIN ONLY)
  //# ================================================================================================================
  //# GET /api/v1/art/admin/auctions (with includeStats=true query param)
  //# This returns both auctions list AND stats in one response for admin
  //# ================================================================================================================
  getAuctionsWithStats = async (
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
        `Fetching auctions with stats page=${page} limit=${limit} status=${status}`
      );

      const dto: GetAuctionsDTO = {
        page,
        limit,
        filterStatus: status,
        startDate,
        endDate,
        hostId: req.query.hostId as string
      };

      const [auctionsResult, stats] = await Promise.all([
        this._getAuctionsUseCase.execute(dto),
        this._getAuctionStatsUseCase.execute('all')
      ]);

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.AUCTIONS_FETCHED,
        data: {
          ...auctionsResult,
          stats
        },
      });
    } catch (error) {
      logger.error('Error in getAuctionsWithStats', error);
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

      const dto: GetAuctionByIdDTO = { id };
      const auction = await this._getAuctionByIdUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.AUCTION_FETCHED,
        data: auction,
      });
    } catch (error) {
      logger.error('Error in getAuction', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET AUCTION STATS
  //# ================================================================================================================
  //# GET /api/v1/art/admin/auctions/stats
  //# This controller fetches statistics for auctions.
  //# ================================================================================================================
  getAuctionStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const timeRange = (req.query.timeRange as string) || '7d';
      logger.info(`Fetching auction stats for range: ${timeRange}`);
      const stats = await this._getAuctionStatsUseCase.execute(timeRange);
      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.AUCTIONS_FETCHED,
        data: stats,
      });
    } catch (error) {
      logger.error('Error in getAuctionStats', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# CANCEL AUCTION
  //# ================================================================================================================
  //# PATCH /api/v1/art/admin/auctions/:id/cancel
  //# Params: id
  //# This controller cancels an auction.
  //# ================================================================================================================
  cancelAuction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const id = req.params.id;
      const userId = req.headers['x-user-id'] as string;

      logger.info(`Cancelling auction id=${id}`);

      await this._cancelAuctionUseCase.execute(id, userId);

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.AUCTION_CANCELLED,
      });
    } catch (error) {
      logger.error('Error in cancelAuction', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET RECENT AUCTIONS
  //# ================================================================================================================
  //# GET /api/v1/art/admin/auctions/recent
  //# Query: limit
  //# This controller fetches a list of recent auctions, limited by the specified number.
  //# ================================================================================================================
  getRecentAuctions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const auctions = await this._getRecentAuctionsUseCase.execute(limit);
      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.RECENT_AUCTIONS_FETCHED,
        data: auctions,
      });
    } catch (error) {
      logger.error('Error in getRecentAuctions', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET USER BIDDING HISTORY
  //# ================================================================================================================
  //# GET /api/v1/art/auctions/bidding-history
  //# This controller fetches a list of auctions won by the user.
  //# ================================================================================================================
  getUserBiddingHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers['x-user-id'] as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      logger.info(`Fetching bidding history for user id=${userId} with page=${page}, limit=${limit}, status=${status}`);

      const auctions = await this._getUserBiddingHistoryUseCase.execute(userId, page, limit, status);

      logger.info(`Fetched ${auctions.length} won auctions for user id=${userId}`);

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.BIDDING_HISTORY_FETCHED,
        data: auctions,
      });
    } catch (error) {
      logger.error('Error in getUserBiddingHistory', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET AUCTION ALERT COUNTS
  //# ================================================================================================================
  //# GET /api/v1/art/auctions/counts
  //# This controller fetches the counts of active and scheduled auctions.
  //# ================================================================================================================
  getAuctionAlertCounts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      logger.info('Fetching auction alert counts (active & scheduled)');
      const stats = await this._getAuctionStatsUseCase.execute('all');

      return res.status(HttpStatus.OK).json({
        message: AUCTION_MESSAGES.AUCTION_COUNTS_FETCHED,
        data: {
          active: stats.active,
          scheduled: stats.scheduled,
        },
      });
    } catch (error) {
      logger.error('Error in getAuctionAlertCounts', error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# SETTLE AUCTION (ADMIN ONLY)
  //# ================================================================================================================
  //# POST /api/v1/art/admin/auctions/:id/settle
  //# Params: id
  //# Handles manual settlement of funds for a completed auction.
  //# ================================================================================================================
  settleAuction = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      logger.info(`Manually settling auction id=${id} (Admin Trigger)`);

      const success = await this._endAuctionUseCase.execute(id);

      if (success) {
        return res.status(HttpStatus.OK).json({
          message: AUCTION_MESSAGES.AUCTION_SETTLED_SUCCESS || 'Auction settled successfully',
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: AUCTION_MESSAGES.AUCTION_SETTLED_FAILED || 'Failed to settle auction',
        });
      }
    } catch (error) {
      logger.error('Error in settleAuction', error);
      next(error);
    }
  };
}
