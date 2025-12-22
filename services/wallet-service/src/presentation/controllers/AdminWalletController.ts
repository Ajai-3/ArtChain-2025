import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/inversify/types';
import { IAdminWalletController } from '../interface/IAdminWalletController';
import { IGetAllWalletsUseCase } from '../../application/interface/usecases/admin/IGetAllWalletsUseCase';
import { ISearchWalletsUseCase } from '../../application/interface/usecases/admin/ISearchWalletsUseCase';
import { IUpdateWalletStatusUseCase } from '../../application/interface/usecases/admin/IUpdateWalletStatusUseCase';
import { IGetUserTransactionsUseCase } from '../../application/interface/usecases/admin/IGetUserTransactionsUseCase';
import { HttpStatus } from "art-chain-shared";
import { GetRevenueStatsDTO } from "../../application/interface/dto/wallet/GetRevenueStatsDTO";
import { IGetRevenueStatsUseCase } from '../../application/interface/usecase/wallet/IGetRevenueStatsUseCase';

@injectable()
export class AdminWalletController implements IAdminWalletController {
  constructor(
    @inject(TYPES.IGetAllWalletsUseCase)
    private readonly _getAllWalletsUseCase: IGetAllWalletsUseCase,
    @inject(TYPES.ISearchWalletsUseCase)
    private readonly _searchWalletsUseCase: ISearchWalletsUseCase,
    @inject(TYPES.IUpdateWalletStatusUseCase)
    private readonly _updateWalletStatusUseCase: IUpdateWalletStatusUseCase,
    @inject(TYPES.IGetUserTransactionsUseCase)
    private readonly _getUserTransactionsUseCase: IGetUserTransactionsUseCase,
    @inject(TYPES.IGetRevenueStatsUseCase)
    private readonly _getRevenueStatsUseCase: IGetRevenueStatsUseCase
  ) {}

  getAllWallets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as 'active' | 'locked' | 'suspended' | undefined;
      const minBalance = req.query.minBalance ? parseFloat(req.query.minBalance as string) : undefined;
      const maxBalance = req.query.maxBalance ? parseFloat(req.query.maxBalance as string) : undefined;
      
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

      const result = await this._getAllWalletsUseCase.execute(page, limit, {
        status,
        minBalance,
        maxBalance,
      }, token);

      res.status(HttpStatus.OK).json({
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
     next(error);
    }
  };

  searchWallets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.query.query as string) || '';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as 'active' | 'locked' | 'suspended' | undefined;
      const minBalance = req.query.minBalance ? parseFloat(req.query.minBalance as string) : undefined;
      const maxBalance = req.query.maxBalance ? parseFloat(req.query.maxBalance as string) : undefined;

      const result = await this._searchWalletsUseCase.execute(query, page, limit, {
        status,
        minBalance,
        maxBalance,
      });

      res.status(HttpStatus.OK).json({
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  updateWalletStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletId } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'locked', 'suspended'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be active, locked, or suspended',
        });
        return;
      }

      const wallet = await this._updateWalletStatusUseCase.execute(walletId, status);

      res.status(HttpStatus.OK).json({
        data: wallet,
        message: `Wallet status updated to ${status}`,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { walletId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const filters: any = {};
      if (req.query.type) filters.type = req.query.type;
      if (req.query.category) filters.category = req.query.category;
      if (req.query.status) filters.status = req.query.status;
      if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
      if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

      const result = await this._getUserTransactionsUseCase.execute(
        walletId,
        page,
        limit,
        filters
      );

      res.status(HttpStatus.OK).json({
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  };

  getRevenueStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = req.headers["x-admin-id"] as string;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const dto: GetRevenueStatsDTO = {
        adminId,
        startDate,
        endDate
      };

      const stats = await this._getRevenueStatsUseCase.execute(dto);

      res.status(HttpStatus.OK).json({
        data: stats,
        body: stats 
      });
    } catch (error) {
      next(error);
    }
  };
}
