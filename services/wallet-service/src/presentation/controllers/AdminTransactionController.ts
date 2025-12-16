import { Request, Response } from 'express';
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

  getAdminTransactions = async (req: Request, res: Response): Promise<void> => {
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

      // Get admin wallet
      const wallet = await this._walletRepository.getByUserId(adminId);
      if (!wallet) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: 'Admin wallet not found',
        });
        return;
      }

      // Get transactions (credited commissions only)
      const transactions = await this._walletRepository.getAdminCommissionTransactions(
        wallet.id,
        startDate,
        endDate
      );

      res.status(HttpStatus.OK).json({
        success: true,
        data: { transactions },
      });
    } catch (error: any) {
      console.error('Error in getAdminTransactions:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to fetch admin transactions',
      });
    }
  };
}
