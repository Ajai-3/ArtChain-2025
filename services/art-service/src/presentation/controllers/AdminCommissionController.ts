import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { GetAllCommissionsUseCase } from "../../application/usecase/commission/GetAllCommissionsUseCase";
import { ResolveCommissionDisputeUseCase } from "../../application/usecase/commission/ResolveCommissionDisputeUseCase";
import { GetCommissionStatsUseCase } from "../../application/usecase/commission/GetCommissionStatsUseCase";
import { HttpStatus } from "art-chain-shared";

@injectable()
export class AdminCommissionController {
  constructor(
    @inject(GetAllCommissionsUseCase)
    private readonly _getAllCommissionsUseCase: GetAllCommissionsUseCase,
    @inject(ResolveCommissionDisputeUseCase)
    private readonly _resolveDisputeUseCase: ResolveCommissionDisputeUseCase,
    @inject(TYPES.IGetCommissionStatsUseCase)
    private readonly _getCommissionStatsUseCase: GetCommissionStatsUseCase
  ) {}

  getAllCommissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as string;

      const result = await this._getAllCommissionsUseCase.execute(page, limit, status);
      return res.status(HttpStatus.OK).json({
        message: "Commissions fetched successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  resolveDispute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { resolution } = req.body; // "REFUND" or "RELEASE"
      
      const result = await this._resolveDisputeUseCase.execute(id, resolution);
      return res.status(HttpStatus.OK).json({
        message: "Dispute resolved successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this._getCommissionStatsUseCase.execute();
      return res.status(HttpStatus.OK).json({
        message: "Commission stats fetched successfully",
        data: result
      });
    } catch (error) {
      next(error);
    }
  };
}
