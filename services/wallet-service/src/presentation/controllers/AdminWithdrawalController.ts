import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { IAdminWithdrawalController } from "../interface/IAdminWithdrawalController";
import { IGetAllWithdrawalRequestsUseCase } from "../../application/interface/usecases/withdrawal/IGetAllWithdrawalRequestsUseCase";
import { IUpdateWithdrawalStatusUseCase } from "../../application/interface/usecases/withdrawal/IUpdateWithdrawalStatusUseCase";
import { WALLET_MESSAGES } from "../../constants/WalletMessages";
import { HttpStatus } from "art-chain-shared";

@injectable()
export class AdminWithdrawalController implements IAdminWithdrawalController {
  constructor(
    @inject(TYPES.IGetAllWithdrawalRequestsUseCase)
    private readonly _getAllWithdrawalRequestsUseCase: IGetAllWithdrawalRequestsUseCase,
    @inject(TYPES.IUpdateWithdrawalStatusUseCase)
    private readonly _updateWithdrawalStatusUseCase: IUpdateWithdrawalStatusUseCase
  ) {
    this.getAllWithdrawalRequests = this.getAllWithdrawalRequests.bind(this);
    this.updateWithdrawalStatus = this.updateWithdrawalStatus.bind(this);
  }

  async getAllWithdrawalRequests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      
      console.log("🔍 Backend received params:", { page, limit, status });
      
      const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;

      const result = await this._getAllWithdrawalRequestsUseCase.execute(page, limit, token, status);

      console.log("✅ Backend returning:", { 
        totalRequests: result.withdrawalRequests?.length, 
        total: result.total,
        statusCounts: result.statusCounts 
      });

      res.status(HttpStatus.OK).json({
        message: WALLET_MESSAGES.WITHDRAWAL_REQUESTS_FETCHED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/v1/wallet/admin/withdrawal/requests/:withdrawalId/status
  async updateWithdrawalStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { withdrawalId } = req.params;
      const { status, rejectionReason } = req.body;

      const updatedWithdrawal = await this._updateWithdrawalStatusUseCase.execute({
        withdrawalId,
        status,
        rejectionReason,
      });

      res.status(HttpStatus.OK).json({
        message: "Withdrawal status updated successfully",
        data: {
          withdrawal: updatedWithdrawal,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
