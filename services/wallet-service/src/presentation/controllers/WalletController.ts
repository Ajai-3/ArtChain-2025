import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/inversify/types";
import { WALLET_MESSAGES } from "../../constants/WalletMessages";
import { IWalletController } from "../interface/IWalletController";
import { IGetWalletUseCase } from "../../application/interface/usecase/wallet/IGetWalletUseCase";
import { ILockFundsUseCase } from "../../application/interface/usecase/wallet/ILockFundsUseCase";
import { IUnlockFundsUseCase } from "../../application/interface/usecase/wallet/IUnlockFundsUseCase";
import { LockFundsDTO } from "../../application/interface/dto/wallet/LockFundsDTO";
import { UnlockFundsDTO } from "../../application/interface/dto/wallet/UnlockFundsDTO";
import { SettleAuctionDTO } from "../../application/interface/dto/wallet/SettleAuctionDTO";
import { ISettleAuctionUseCase } from "../../application/interface/usecase/wallet/ISettleAuctionUseCase";
import { IGetWalletChartDataUseCase } from "../../application/interface/usecase/wallet/IGetWalletChartDataUseCase";
import { IGiftArtCoinsUseCase } from "../../application/interface/usecase/wallet/IGiftArtCoinsUseCase";
import { IProcessSplitPurchaseUseCase } from "../../application/interface/usecase/transaction/IProcessSplitPurchaseUseCase";
import { ProcessSplitPurchaseDTO } from "../../application/interface/dto/transaction/ProcessSplitPurchaseDTO";
import { validateWithZod } from "../../utils/zodValidator";
import { giftArtCoinsSchema } from "../../application/validation/giftArtCoinsSchema";

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject(TYPES.IGetWalletUseCase)
    private readonly _getWalletUseCase: IGetWalletUseCase,
    @inject(TYPES.ILockFundsUseCase)
    private readonly _lockFundsUseCase: ILockFundsUseCase,
    @inject(TYPES.IUnlockFundsUseCase)
    private readonly _unlockFundsUseCase: IUnlockFundsUseCase,
    @inject(TYPES.ISettleAuctionUseCase)
    private readonly _settleAuctionUseCase: ISettleAuctionUseCase,
    @inject(TYPES.IGetWalletChartDataUseCase)
    private readonly _getWalletChartDataUseCase: IGetWalletChartDataUseCase,
    @inject(TYPES.IGiftArtCoinsUseCase)
    private readonly _giftArtCoinsUseCase: IGiftArtCoinsUseCase,
    @inject(TYPES.IProcessSplitPurchaseUseCase)
    private readonly _processSplitPurchaseUseCase: IProcessSplitPurchaseUseCase
  ) {}

  // ... (existing methods)

  //# ================================================================================================================
  //# GET CHART DATA
  //# ================================================================================================================
  //# GET /api/v1/wallet/stats/chart
  //# Query: timeRange (7d, 1m, all)
  //# Headers: x-user-id
  //# ================================================================================================================
  getChartData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const timeRange = (req.query.timeRange as "7d" | "1m" | "all") || "7d";
      
      logger.info(`[WalletController] Fetching chart data for userId: ${userId}, range: ${timeRange}`);

      const chartData = await this._getWalletChartDataUseCase.execute(userId, timeRange);

      // be - message must eb constant
      return res.status(HttpStatus.OK).json({
        message: "Chart data fetched successfully",
        data: chartData
      });
    } catch (error) {
      logger.error(`[WalletController] Error fetching chart data: ${error}`);
      next(error);
    }
  };


  //# ================================================================================================================
  //# GET WALLET
  //# ================================================================================================================
  //# GET /api/v1/wallet/details
  //# Request headers: x-user-id
  //# This controller helps the currently logged-in user get their wallet details
  //# ================================================================================================================
  getWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      logger.info(`[WalletController] Fetching wallet for userId: ${userId}`);

      const walletData = await this._getWalletUseCase.execute(userId);

      if (!walletData) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: WALLET_MESSAGES.NOT_FOUND,
        });
      }

      logger.info(
        `[WalletController] Successfully fetched wallet for userId: ${userId}`
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: WALLET_MESSAGES.FETCH_SUCCESS, wallet: walletData });
    } catch (error) {
      logger.error(`[WalletController] Error in getting wallet: ${error}`);
      next(error);
    }
  };

  //# ================================================================================================================
  //# CREATE WALLET
  //# ================================================================================================================
  //# POST /api/v1/wallet/create
  //# Request headers: x-user-id
  //# This controller helps the user create a wallet
  //# ================================================================================================================
  createWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      logger.info(`[WalletController] Creating wallet for userId: ${userId}`);

      logger.info(
        `[WalletController] Wallet created successfully for userId: ${userId}`
      );
      return res
        .status(HttpStatus.CREATED)
        .json({ message: WALLET_MESSAGES.CREATE_SUCCESS });
    } catch (error) {
      logger.error(`[WalletController] Error in creating wallet: ${error}`);
      next(error);
    }
  };

  //# ================================================================================================================
  //# UPDATE WALLET
  //# ================================================================================================================
  //# PATCH /api/v1/wallet/update
  //# Request headers: x-user-id
  //# This controller helps the user update their wallet
  //# ================================================================================================================
  updateWallet = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const updateData = req.body;
      logger.info(
        `[WalletController] Updating wallet for userId: ${userId} with data: ${JSON.stringify(
          updateData
        )}`
      );


      logger.info(
        `[WalletController] Wallet updated successfully for userId: ${userId}`
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: WALLET_MESSAGES.UPDATE_SUCCESS });
    } catch (error) {
      logger.error(`[WalletController] Error updating wallet: ${error}`);
      next(error);
    }
  };

  //# ================================================================================================================
  //# LOCK FUNDS
  //# ================================================================================================================
  //# POST /api/v1/wallet/lock
  //# Body: userId, amount, auctionId
  //# This controller locks funds for a user during a bid or purchase.
  //# ================================================================================================================
  lockAmount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId, amount, auctionId } = req.body;
      logger.info(`[WalletController] Locking ${amount} for user ${userId}`);

      const dto: LockFundsDTO = {
        userId,
        amount,
        auctionId
      };

      const result = await this._lockFundsUseCase.execute(dto);
      
      return res.status(HttpStatus.OK).json({ success: result });
    } catch (error) {
      logger.error(`[WalletController] Error locking funds: ${error}`);
      next(error);
    }
  };

  //# ================================================================================================================
  //# UNLOCK FUNDS
  //# ================================================================================================================
  //# POST /api/v1/wallet/unlock
  //# Body: userId, amount, auctionId
  //# This controller unlocks previously locked funds.
  //# ================================================================================================================
  unlockAmount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId, amount, auctionId } = req.body;
      // be - add a zod validation here
      logger.info(`[WalletController] Unlocking ${amount} for user ${userId}`);

      const dto: UnlockFundsDTO = {
        userId,
        amount,
        auctionId
      };

      const result = await this._unlockFundsUseCase.execute(dto);
      
      return res.status(HttpStatus.OK).json({ success: result });
    } catch (error) {
      logger.error(`[WalletController] Error unlocking funds: ${error}`);
      next(error);
    }
  };

  //# ================================================================================================================
  //# SETTLE AUCTION FUNDS
  //# ================================================================================================================
  //# POST /api/v1/wallet/settle-auction
  //# Request body: winnerId, sellerId, totalAmount, commissionAmount, auctionId
  //# This controller settles funds after an auction ends (Split payment).
  //# ================================================================================================================
  settleAuction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { winnerId, sellerId, totalAmount, commissionAmount, auctionId } = req.body;
      // be - use a zod validation here winner and seller cannot be same id 
      
      logger.info(`[WalletController] Settling auction ${auctionId}`);

      const dto: SettleAuctionDTO = {
        winnerId,
        sellerId,
        totalAmount,
        commissionAmount,
        auctionId
      };

      const result = await this._settleAuctionUseCase.execute(dto);

      // be - remove the !result form her controller dose nto use this thing it violationg the clean arcitecture rules
      if (!result) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: "Failed to settle auction funds" });
      }

      //  be - message must be contsnts
      return res.status(HttpStatus.OK).json({ message: "Auction funds settled successfully" });
    } catch (error) {
       logger.error(`[WalletController] Error settling auction: ${error}`);
       next(error);
    }
  };

  //# ================================================================================================================
    //# PROCESS SPLIT PURCHASE
    //# ================================================================================================================
    //# POST /api/v1/wallet/transaction/split-purchase
    //# Request body: { buyerId, sellerId, totalAmount, commissionAmount, artId }
    //# This controller handles art purchase transactions with commission split
    //# ================================================================================================================
    processSplitPurchase = async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      try {
        const { buyerId, sellerId, totalAmount, commissionAmount, artId } = req.body;
  
        logger.info(
          `[WalletController] Processing split purchase for art: ${artId} | buyer: ${buyerId} | seller: ${sellerId}`
        );

        // be - add zod validation here 
        
        const dto: ProcessSplitPurchaseDTO = {
          buyerId, 
          sellerId, 
          totalAmount, 
          commissionAmount, 
          artId
        };
  
        const success = await this._processSplitPurchaseUseCase.execute(dto);
  
        if (success) {
          logger.info(
            `[WalletController] Split purchase processed successfully for art: ${artId}`
          );
          return res
            .status(HttpStatus.OK)
            //be - message must be constant
            .json({ message: "Purchase successful" });
        } else {
          return res
            .status(HttpStatus.BAD_REQUEST)
            // be - message must be constants
            .json({ message: "Purchase failed" });
        }
      } catch (error) {
        logger.error(
          `[WalletController] Error processing split purchase: ${error}`
        );
        next(error);
      }
    };

  //# ================================================================================================================
  //# GIFT ART COINS
  //# ================================================================================================================
  //# POST /api/v1/wallet/gift
  //# Request headers: x-user-id
  //# Body: receiverId, amount, message
  //# ================================================================================================================
  giftArtCoins = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const senderId = req.headers["x-user-id"] as string;

      // be - send the senderId also to the  zod validation ust check th sender and reciver id not same also the amoutn must be between greter than 0 and less than or equals 10000 okay no desimal values message max lenght must be 100 charecters message also optional 
      const { receiverId, amount, message } = validateWithZod(giftArtCoinsSchema, req.body);

      logger.info(`[WalletController] Gifting ${amount} from ${senderId} to ${receiverId}`);

      // be - use propper dto to pass th values to the use case 
      const result = await this._giftArtCoinsUseCase.execute({
        senderId,
        receiverId,
        amount,
        message,
      });

      return res.status(HttpStatus.OK).json({ 
        // be - message must be in contsnts
        message: "Art coins gifted successfully", 
        newBalance: result.newBalance,
        lockedAmount: result.lockedAmount
      });
    } catch (error) {
      logger.error(`[WalletController] Error gifting art coins: ${error}`);
      next(error);
    }
  };
}
