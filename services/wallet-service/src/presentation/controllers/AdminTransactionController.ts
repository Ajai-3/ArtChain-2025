import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/inversify/types';
import { IWalletRepository } from '../../domain/repository/IWalletRepository';
import { HttpStatus } from 'art-chain-shared';

@injectable()
export class AdminTransactionController {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  getAdminTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { adminId } = req.params;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      if (!adminId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Admin ID is required',
        });
        return;
      }

      const wallet = await this._walletRepository.getByUserId(adminId);
      if (!wallet) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Admin wallet not found',
        });
        return;
      }

      const transactions = await this._walletRepository.getAdminCommissionTransactions(
        wallet.id,
        startDate,
        endDate
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: { transactions },
      });
    } catch (error) {
      next(error);
    }
  };
}
