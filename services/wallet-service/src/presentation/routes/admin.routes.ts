import express from "express";
import { TYPES } from "../../infrastructure/inversify/types";
import { container } from "../../infrastructure/inversify/inversify.config";
import { IAdminWalletController } from "../interface/IAdminWalletController";
import { ROUTES } from "../../constants/routes";

const router = express.Router();

const adminWalletController = container.get<IAdminWalletController>(
  TYPES.IAdminWalletController
);

// Get all wallets (paginated, filtered)
router.get(ROUTES.ADMIN.WALLETS, adminWalletController.getAllWallets);

// Search wallets
router.get(ROUTES.ADMIN.SEARCH_WALLETS, adminWalletController.searchWallets);

// Update wallet status
router.patch(ROUTES.ADMIN.UPDATE_STATUS, adminWalletController.updateWalletStatus);

// Get user transactions
router.get(ROUTES.ADMIN.GET_USER_TRANSACTIONS, adminWalletController.getUserTransactions);

// Get revenue stats
router.get(ROUTES.ADMIN.REVENUE_STATS, adminWalletController.getRevenueStats);

// Admin Withdrawal Management
import { IAdminWithdrawalController } from "../interface/IAdminWithdrawalController";
const adminWithdrawalController = container.get<IAdminWithdrawalController>(
  TYPES.IAdminWithdrawalController
);

// Get all withdrawal requests
router.get(ROUTES.ADMIN.WITHDRAWAL_REQUESTS, adminWithdrawalController.getAllWithdrawalRequests);

// Update withdrawal status
router.patch(ROUTES.ADMIN.UPDATE_WITHDRAWAL_STATUS, adminWithdrawalController.updateWithdrawalStatus);

export default router;
