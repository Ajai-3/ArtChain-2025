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
import { IProcessPurchaseUseCase } from "../../application/interface/usecase/transaction/IProcessPurchaseUseCase";
import { IProcessSplitPurchaseUseCase } from "../../application/interface/usecase/transaction/IProcessSplitPurchaseUseCase";
import { ProcessSplitPurchaseDTO } from "../../application/interface/dto/transaction/ProcessSplitPurchaseDTO";
import { IProcessPaymentUseCase } from "../../application/interface/usecase/transaction/IProcessPaymentUseCase";
import { ProcessPaymentDTO } from "../../application/interface/dto/transaction/ProcessPaymentDTO";
import { ILockCommissionFundsUseCase } from "../../application/interface/usecase/transaction/ILockCommissionFundsUseCase";
import { IDistributeCommissionFundsUseCase } from "../../application/interface/usecase/transaction/IDistributeCommissionFundsUseCase";
import { IRefundCommissionFundsUseCase } from "../../application/interface/usecase/transaction/IRefundCommissionFundsUseCase";

@injectable()
export class TransactionController implements ITransactionController {
  constructor(
    @inject(TYPES.IGetTransactionsUseCase)
    private readonly _getTransactionsUseCase: IGetTransactionsUseCase,
    @inject(TYPES.IProcessPurchaseUseCase)
    private readonly _processPurchaseUseCase: IProcessPurchaseUseCase,
    @inject(TYPES.IProcessSplitPurchaseUseCase)
    private readonly _processSplitPurchaseUseCase: IProcessSplitPurchaseUseCase,
    @inject(TYPES.IProcessPaymentUseCase)
    private readonly _processPaymentUseCase: IProcessPaymentUseCase,
    @inject(TYPES.ILockCommissionFundsUseCase)
    private readonly _lockCommissionFundsUseCase: ILockCommissionFundsUseCase,
    @inject(TYPES.IDistributeCommissionFundsUseCase)
    private readonly _distributeCommissionFundsUseCase: IDistributeCommissionFundsUseCase,
    @inject(TYPES.IRefundCommissionFundsUseCase)
    private readonly _refundCommissionFundsUseCase: IRefundCommissionFundsUseCase
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

  //# ================================================================================================================
  //# PROCESS PURCHASE
  //# ================================================================================================================
  //# POST /api/v1/transaction/purchase
  //# Request body: { buyerId, sellerId, amount, artId }
  //# This controller handles art purchase transactions
  //# ================================================================================================================
  processPurchase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { buyerId, sellerId, amount, artId } = req.body;

      logger.info(
        `[TransactionController] Processing purchase for art: ${artId} | buyer: ${buyerId} | seller: ${sellerId}`
      );

      const success = await this._processPurchaseUseCase.execute(
        buyerId,
        sellerId,
        amount,
        artId
      );

      if (success) {
        logger.info(
          `[TransactionController] Purchase processed successfully for art: ${artId}`
        );
        return res
          .status(HttpStatus.OK)
          .json({ message: "Purchase successful" });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Purchase failed" });
      }
    } catch (error) {
      logger.error(
        `[TransactionController] Error processing purchase: ${error}`
      );
      next(error);
    }
  };

  //# ================================================================================================================
  //# PROCESS SPLIT PURCHASE
  //# ================================================================================================================
  //# POST /api/v1/transaction/split-purchase
  //# Request body: { buyerId, sellerId, adminId, totalAmount, commissionAmount, artId }
  //# This controller handles art purchase transactions with commission split
  //# ================================================================================================================
  processSplitPurchase = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { buyerId, sellerId, adminId, totalAmount, commissionAmount, artId } = req.body;

      logger.info(
        `[TransactionController] Processing split purchase for art: ${artId} | buyer: ${buyerId} | seller: ${sellerId}`
      );
      
      const dto: ProcessSplitPurchaseDTO = {
        buyerId, 
        sellerId, 
        adminId, 
        totalAmount, 
        commissionAmount, 
        artId
      };

      const success = await this._processSplitPurchaseUseCase.execute(dto);

      if (success) {
        logger.info(
          `[TransactionController] Split purchase processed successfully for art: ${artId}`
        );
        return res
          .status(HttpStatus.OK)
          .json({ message: "Purchase successful" });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Purchase failed" });
      }
    } catch (error) {
      logger.error(
        `[TransactionController] Error processing split purchase: ${error}`
      );
      next(error);
    }
  };

  //# ================================================================================================================
  //# PROCESS PAYMENT
  //# ================================================================================================================
  //# POST /api/v1/transaction/payment
  //# Request body: { payerId, payeeId, amount, description, referenceId, category }
  //# This controller handles generic payments (e.g. AI Generation costs)
  //# ================================================================================================================
  processPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { payerId, payeeId, amount, description, referenceId, category } = req.body;

      logger.info(
        `[TransactionController] Processing payment: From ${payerId} to ${payeeId} | Amount: ${amount}`
      );
      
      const dto: ProcessPaymentDTO = {
        payerId, 
        payeeId, 
        amount, 
        description, 
        referenceId, 
        category
      };

      const success = await this._processPaymentUseCase.execute(dto);

      if (success) {
        logger.info(
          `[TransactionController] Payment processed successfully for reference: ${referenceId}`
        );
        return res
          .status(HttpStatus.OK)
          .json({ message: "Payment successful" });
      } else {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "Payment failed" });
      }
    } catch (error) {
      logger.error(
        `[TransactionController] Error processing payment: ${error}`
      );
      next(error);
    }
  };

  //# ================================================================================================================
  //# LOCK COMMISSION FUNDS
  //# ================================================================================================================
  //# POST /api/v1/transaction/commission/lock
  //# Request body: { userId, commissionId, amount }
  //# ================================================================================================================
  lockCommissionFunds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId, commissionId, amount } = req.body;
      const success = await this._lockCommissionFundsUseCase.execute(userId, commissionId, amount);
      if (success) {
        return res.status(HttpStatus.OK).json({ message: "Funds locked successfully" });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to lock funds" });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# DISTRIBUTE COMMISSION FUNDS
  //# ================================================================================================================
  //# POST /api/v1/transaction/commission/distribute
  //# Request body: { userId, artistId, commissionId, totalAmount, artistAmount, platformFee }
  //# ================================================================================================================
  distributeCommissionFunds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const success = await this._distributeCommissionFundsUseCase.execute(req.body);
      if (success) {
        return res.status(HttpStatus.OK).json({ message: "Funds distributed successfully" });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to distribute funds" });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# REFUND COMMISSION FUNDS
  //# ================================================================================================================
  //# POST /api/v1/transaction/commission/refund
  //# Request body: { userId, commissionId, amount }
  //# ================================================================================================================
  refundCommissionFunds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId, commissionId, amount } = req.body;
      const success = await this._refundCommissionFundsUseCase.execute(userId, commissionId, amount);
      if (success) {
        return res.status(HttpStatus.OK).json({ message: "Funds refunded successfully" });
      }
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to refund funds" });
    } catch (error) {
      next(error);
    }
  };
}
