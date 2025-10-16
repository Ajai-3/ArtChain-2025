import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/inversify/types";
import { TRANSACTION_MESSAGES } from "../../constants/TransactionMessages";
import { ITransactionController } from "../interface/ITransactionController";
import { GetTransactionsDto } from "../../application/interface/dto/transaction/GetTransactionsDto";
import {
  TransactionMethod,
  TransactionCategory,
  TransactionType,
  TransactionStatus,
} from "./../../domain/entities/Transaction";
import { IGetTransactionsUseCase } from "../../application/interface/usecase/transaction/IGetTransactionsUseCase";

@injectable()
export class TransactionController implements ITransactionController {
  constructor(
    @inject(TYPES.IGetTransactionsUseCase)
    private readonly _getTransactionsUseCase: IGetTransactionsUseCase
  ) {}

  //# ================================================================================================================
  //# GET TRANSACTIONS
  //# ================================================================================================================
  //# GET /api/v1/transaction
  //# Request headers: x-user-id
  //# Query params (optional): page, limit, method, type
  //# This controller fetches transactions of the logged-in user's wallet
  //# Supports pagination and optional filtering by method and type
  //# ================================================================================================================
  getTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as TransactionStatus;
      const method = req.query.method as TransactionMethod;
      const category = req.query.category as TransactionCategory;
      const type = req.query.type as TransactionType;

      logger.info(
        `[TransactionController] Fetching transactions for userId: ${userId} | page: ${page}`
      );

      const dto: GetTransactionsDto = {
        userId,
        page,
        limit,
        method,
        category,
        status,
        type,
      };
      console.log(dto);
      const transactionData = await this._getTransactionsUseCase.execute(dto);

      logger.info(
        `[TransactionController] Successfully fetched transactions for userId: ${userId}`
      );
      return res.status(HttpStatus.OK).json({
        message: TRANSACTION_MESSAGES.FETCH_SUCCESS,
        ...transactionData,
      });
    } catch (error) {
      logger.error(
        `[TransactionController] Error fetching transactions: ${error}`
      );
      next(error);
    }
  };

  //# ================================================================================================================
  //# CREATE TRANSACTION
  //# ================================================================================================================
  //# POST /api/v1/transaction
  //# Request headers: x-user-id
  //# Request body: { type, amount, description }
  //# This controller helps the user create a transaction
  //# ================================================================================================================
  createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { type, category, amount, description } = req.body;

      logger.info(
        `[TransactionController] Creating transaction for userId: ${userId} | data: ${JSON.stringify(
          req.body
        )}`
      );

      // Your logic to create transaction goes here
      // const transaction = await transactionRepo.create({ walletId, type, amount, description });

      logger.info(
        `[TransactionController] Transaction created successfully for userId: ${userId}`
      );
      return res
        .status(HttpStatus.CREATED)
        .json({ message: TRANSACTION_MESSAGES.CREATE_SUCCESS });
    } catch (error) {
      logger.error(
        `[TransactionController] Error creating transaction: ${error}`
      );
      next(error);
    }
  };
}
