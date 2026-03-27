import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../infrastructure/inversify/types';
import { HttpStatus } from 'art-chain-shared';
import { WALLET_MESSAGES } from '../../constants/WalletMessages';
import { IGetAdminTransactionsUseCase } from '../../application/interface/usecase/admin/IGetAdminTransactionsUseCase';

@injectable()
export class AdminTransactionController {
  constructor(
    @inject(TYPES.IGetAdminTransactionsUseCase)
    private readonly _getAdminTransactionsUseCase: IGetAdminTransactionsUseCase
  ) {}

  getAdminTransactions = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { adminId } = req.params;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const transactions = await this._getAdminTransactionsUseCase.execute(adminId, startDate, endDate);

      return res.status(HttpStatus.OK).json({
        message: WALLET_MESSAGES.ADMIN_TRANSACTIONS_FETCH_SUCCESS,
        data: { transactions },
      });
    } catch (error) {
      next(error);
    }
  };
}
