import express from "express";
import bodyParser from "body-parser";

import { TYPES } from "../../infrastructure/inversify/types";
import { IWalletController } from "../interface/IWalletController";
import { IStripeController } from "./../interface/IStripeController";
import { container } from "../../infrastructure/inversify/inversify.config";
import { ITransactionController } from "../interface/ITransactionController";

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
router.get("/details", walletController.getWallet);
router.post("/create", walletController.createWallet);
router.patch("/update", walletController.updateWallet);

// Trascation Controller Routes
router.get("/get-transactions", transactionController.getTransactions);
router.post("/create-transaction", transactionController.createTransaction);

// Stripe Controller Routes
router.post(
  "/stripe/create-checkout-session",
  stripeController.createCheckoutSession
);
router.get("/stripe/session/:id", stripeController.getSession);
router.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeController.handleWebhook
);

export default router;
