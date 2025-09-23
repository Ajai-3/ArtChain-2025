import express from "express";
import bodyParser from "body-parser";
import { walletController } from "../../infrastructure/container/WalletContainer";
import { transactionController } from "../../infrastructure/container/TransactionContainer";
import { stripeController } from "../../infrastructure/container/StripeContainer";

const router = express.Router();

router.get("/details", walletController.getWallet);
router.post("/create", walletController.createWallet);
router.patch("/update", walletController.updateWallet);

router.get("/get-transactions", transactionController.getTransactions);
router.post("/create-transaction", transactionController.createTransaction);

router.post(
  "/stripe/create-checkout-session",
  stripeController.createCheckoutSession
);
router.get("/stripe/session/:id", stripeController.getSession)
router.post(
  "/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeController.handleWebhook
);

export default router;
