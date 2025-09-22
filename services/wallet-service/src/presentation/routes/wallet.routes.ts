import express from "express";
import { walletController } from "../../infrastructure/container/WalletContainer";
import { transactionController } from "../../infrastructure/container/TransactionContainer";


const router = express.Router();

router.get("/details", walletController.getWallet);
router.post("/create", walletController.createWallet);
router.patch("/update", walletController.updateWallet);

router.get("/get-transactions", transactionController.getTransactions)
router.post("/create-transaction", transactionController.createTransaction)

export default router