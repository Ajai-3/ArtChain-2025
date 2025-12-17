import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/inversify/types";
import { WALLET_MESSAGES } from "../../constants/WalletMessages";
import { IWithdrawalController } from "../interface/IWithdrawalController";
import { ICreateWithdrawalRequestUseCase } from "../../application/interface/usecases/withdrawal/ICreateWithdrawalRequestUseCase";
import { IGetWithdrawalRequestsUseCase } from "../../application/interface/usecases/withdrawal/IGetWithdrawalRequestsUseCase";
import { createWithdrawalRequestSchema } from "../../application/validation/withdrawalValidation";
import { CreateWithdrawalRequestDTO } from "../../application/interface/dto/withdrawal/CreateWithdrawalRequestDTO";
import { GetWithdrawalRequestsDTO } from "../../application/interface/dto/withdrawal/GetWithdrawalRequestsDTO";
import { validateWithZod } from "../../utils/zodValidator";

@injectable()
export class WithdrawalController implements IWithdrawalController {
  constructor(
    @inject(TYPES.ICreateWithdrawalRequestUseCase)
    private readonly _createWithdrawalRequestUseCase: ICreateWithdrawalRequestUseCase,
    @inject(TYPES.IGetWithdrawalRequestsUseCase)
    private readonly _getWithdrawalRequestsUseCase: IGetWithdrawalRequestsUseCase
  ) {}

  //# ================================================================================================================
  //# CREATE WITHDRAWAL REQUEST
  //# ================================================================================================================
  //# POST /api/v1/wallet/withdrawal/create
  //# Request headers: x-user-id
  //# Request body: amount, method, accountHolderName?, accountNumber?, ifscCode?, upiId?
  //# This controller creates a withdrawal request and deducts the amount from user's wallet
  //# ================================================================================================================
  createWithdrawalRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      logger.info(`[WithdrawalController] Creating withdrawal request for userId: ${userId}`);

      const validatedData = validateWithZod(createWithdrawalRequestSchema, req.body);

      const dto: CreateWithdrawalRequestDTO = {
        userId,
        amount: validatedData.amount,
        method: validatedData.method,
        accountHolderName: validatedData.accountHolderName,
        accountNumber: validatedData.accountNumber,
        ifscCode: validatedData.ifscCode,
        upiId: validatedData.upiId,
      };

      const result = await this._createWithdrawalRequestUseCase.execute(dto);

      logger.info(
        `[WithdrawalController] Withdrawal request created successfully for userId: ${userId}`
      );

      return res.status(HttpStatus.CREATED).json({
        message: WALLET_MESSAGES.WITHDRAWAL_REQUEST_CREATED,
        withdrawalRequest: result.withdrawalRequest,
        wallet: result.wallet,
      });
    } catch (error) {
      logger.error(`[WithdrawalController] Error creating withdrawal request: ${error}`);
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET WITHDRAWAL REQUESTS
  //# ================================================================================================================
  //# GET /api/v1/wallet/withdrawal/requests
  //# Request headers: x-user-id
  //# This controller fetches all withdrawal requests for the logged-in user
  //# ================================================================================================================
  getWithdrawalRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const status = req.query.status as string;
      const method = req.query.method as string;

      logger.info(`[WithdrawalController] Fetching withdrawal requests for userId: ${userId}, page: ${page}, limit: ${limit}, status: ${status}, method: ${method}`);

      const dto: GetWithdrawalRequestsDTO = { userId, page, limit, status, method };

      const { requests, total } = await this._getWithdrawalRequestsUseCase.execute(dto);

      logger.info(
        `[WithdrawalController] Successfully fetched ${requests.length} withdrawal requests for userId: ${userId}`
      );

      return res.status(HttpStatus.OK).json({
        message: WALLET_MESSAGES.WITHDRAWAL_REQUESTS_FETCHED,
        withdrawalRequests: requests,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      logger.error(`[WithdrawalController] Error fetching withdrawal requests: ${error}`);
      next(error);
    }
  };
}
