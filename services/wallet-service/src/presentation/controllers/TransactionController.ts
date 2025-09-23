import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { TRANSACTION_MESSAGES } from "../../constants/TransactionMessages";
import { ITransactionController } from "../interface/ITransactionController";


export class TransactionController implements ITransactionController {
  constructor() {}

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
      const method = req.query.method as "stripe" | "razorpay" | undefined;
      const type = req.query.type as "credited" | "debited" | undefined;

      logger.info(
        `[TransactionController] Fetching transactions for userId: ${userId} | page: ${page}`
      );

      // Your logic to fetch transactions goes here
      // const transactions = await transactionRepo.getByWalletId(userId, page, limit);

      logger.info(
        `[TransactionController] Successfully fetched transactions for userId: ${userId}`
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: TRANSACTION_MESSAGES.FETCH_SUCCESS });
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
      const { type, amount, description } = req.body;

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
