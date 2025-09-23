import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { WALLET_MESSAGES } from "../../constants/WalletMessages";
import { IWalletController } from "../interface/IWalletController";



export class WalletController implements IWalletController {
  constructor() {}


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

      // Your logic to get wallet goes here
      // const wallet = await walletRepo.getByUserId(userId);

      logger.info(
        `[WalletController] Successfully fetched wallet for userId: ${userId}`
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: WALLET_MESSAGES.FETCH_SUCCESS });
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

      // Your logic to create wallet goes here
      // const wallet = await walletRepo.create(userId);

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

      // Your logic to update wallet goes here
      // const wallet = await walletRepo.update(userId, updateData);

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
}
