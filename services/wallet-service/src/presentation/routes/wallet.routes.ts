import express from "express";
import bodyParser from "body-parser";

import { TYPES } from "../../infrastructure/inversify/types";
import { IWalletController } from "../interface/IWalletController";
import { IStripeController } from "./../interface/IStripeController";
import { container } from "../../infrastructure/inversify/inversify.config";
import { ITransactionController } from "../interface/ITransactionController";
import { IWithdrawalController } from "../interface/IWithdrawalController";
import { ROUTES } from "../../constants/routes";

const router = express.Router();

const stripeController = container.get<IStripeController>(
  TYPES.IStripeController
);
const walletController = container.get<IWalletController>(
  TYPES.IWalletController
);
const transactionController = container.get<ITransactionController>(
  TYPES.ITransactionController
);

// Wallet Controller Routes
router.get(ROUTES.WALLET.DETAILS, walletController.getWallet);
router.get(ROUTES.WALLET.STATS_CHART, walletController.getChartData);
router.post(ROUTES.WALLET.CREATE, walletController.createWallet);
router.patch(ROUTES.WALLET.UPDATE, walletController.updateWallet);
router.post(ROUTES.WALLET.LOCK, walletController.lockAmount);
router.post(ROUTES.WALLET.UNLOCK, walletController.unlockAmount);
router.post(ROUTES.WALLET.SETTLE_AUCTION, walletController.settleAuction);
router.post(ROUTES.WALLET.GIFT, walletController.giftArtCoins);

// Trascation Controller Routes
router.get(ROUTES.TRANSACTION.GET_TRANSACTIONS, transactionController.getTransactions);
router.post(ROUTES.TRANSACTION.CREATE_TRANSACTION, transactionController.createTransaction);
router.post(ROUTES.TRANSACTION.PURCHASE, transactionController.processPurchase);
router.post(ROUTES.TRANSACTION.SPLIT_PURCHASE, transactionController.processSplitPurchase);
router.post(ROUTES.TRANSACTION.PAYMENT, transactionController.processPayment);
router.post(ROUTES.TRANSACTION.COMMISSION_LOCK, transactionController.lockCommissionFunds);
router.post(ROUTES.TRANSACTION.COMMISSION_DISTRIBUTE, transactionController.distributeCommissionFunds);
router.post(ROUTES.TRANSACTION.COMMISSION_REFUND, transactionController.refundCommissionFunds);

// Stripe Controller Routes
router.post(
  ROUTES.STRIPE.CREATE_CHECKOUT_SESSION,
  stripeController.createCheckoutSession
);
router.get(ROUTES.STRIPE.SESSION_BY_ID, stripeController.getSession);
router.post(
  ROUTES.STRIPE.WEBHOOK,
  bodyParser.raw({ type: "application/json" }),
  stripeController.handleWebhook
);

// Withdrawal Controller Routes
const withdrawalController = container.get<IWithdrawalController>(
  TYPES.IWithdrawalController
);
router.post(ROUTES.WITHDRAWAL.CREATE_REQUEST, withdrawalController.createWithdrawalRequest);
router.get(ROUTES.WITHDRAWAL.GET_REQUESTS, withdrawalController.getWithdrawalRequests);

export default router;
