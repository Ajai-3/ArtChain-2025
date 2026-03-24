import { HttpStatus } from 'art-chain-shared';
import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../infrastructure/Inversify/types';
import { COMMISSION_MESSAGES } from '../../constants/CommissionMessage';
import { GetAllCommissionsUseCase } from '../../application/usecase/commission/GetAllCommissionsUseCase';
import { ResolveCommissionDisputeUseCase } from '../../application/usecase/commission/ResolveCommissionDisputeUseCase';
import { IGetCommissionStatsUseCase } from '../../application/interface/usecase/commission/IGetCommissionStatsUseCase';
import { IGetRecentCommissionsUseCase } from '../../application/interface/usecase/admin/IGetRecentCommissionsUseCase';

@injectable()
export class AdminCommissionController {
  constructor(
    @inject(GetAllCommissionsUseCase)
    private readonly _getAllCommissionsUseCase: GetAllCommissionsUseCase,
    @inject(ResolveCommissionDisputeUseCase)
    private readonly _resolveDisputeUseCase: ResolveCommissionDisputeUseCase,
    @inject(TYPES.IGetCommissionStatsUseCase)
    private readonly _getCommissionStatsUseCase: IGetCommissionStatsUseCase,
    @inject(TYPES.IGetRecentCommissionsUseCase)
    private readonly _getRecentCommissionsUseCase: IGetRecentCommissionsUseCase,
  ) {}

  //# ================================================================================================================
  //# GET ALL COMMISSIONS
  //# ================================================================================================================
  //# GET /api/v1/art/admin/commissions
  //# This endpoint allows admin to retrieve a paginated list of all commissions with optional filter for status. It also
  //# returns overall commission statistics in the response.
  //# ================================================================================================================
  getAllCommissions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as string;

      const result = await this._getAllCommissionsUseCase.execute(
        page,
        limit,
        status,
      );
      return res.status(HttpStatus.OK).json({
        message: COMMISSION_MESSAGES.COMMISSION_LIST_FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# RESOLVE COMMISSION DISPUTE
  //# ================================================================================================================
  //# POST /api/v1/art/admin/commissions/:id/resolve-dispute
  //# This endpoint allows admin to resolve a commission dispute by either refunding the buyer or releasing the payment to
  //# the artist. The commission is identified by its ID in the URL path, and the resolution action (refund or release) is
  //# provided in the request body.
  //# ================================================================================================================
  resolveDispute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { resolution } = req.body;

      const result = await this._resolveDisputeUseCase.execute(id, resolution);
      return res.status(HttpStatus.OK).json({
        message: COMMISSION_MESSAGES.COMMISSION_DISPUTE_RESOLVED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET COMMISSION STATS
  //# ================================================================================================================
  //# GET /api/v1/art/admin/commissions/stats
  //# This endpoint allows admin to retrieve overall statistics about commissions, including counts by status, total revenue,
  //# active disputes, and other relevant metrics. An optional time range filter can be applied to get stats for a specific period.
  //# ================================================================================================================
  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const timeRange = (req.query.timeRange as string) || '7d';
      const result = await this._getCommissionStatsUseCase.execute(timeRange);
      return res.status(HttpStatus.OK).json({
        message: COMMISSION_MESSAGES.COMMISSION_STATS_FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET RECENT COMMISSIONS
  //# ================================================================================================================
  //# GET /api/v1/art/admin/commissions/recent
  //# This endpoint allows admin to retrieve a list of the most recent commissions, limited by a specified number. This can
  //# help admin quickly see the latest activity in terms of commission requests and agreements.
  //# ================================================================================================================
  getRecentCommissions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const limit = Number(req.query.limit) || 5;
      const result = await this._getRecentCommissionsUseCase.execute(limit);
      return res.status(HttpStatus.OK).json({
        message: COMMISSION_MESSAGES.RECENT_COMMISSIONS_FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
