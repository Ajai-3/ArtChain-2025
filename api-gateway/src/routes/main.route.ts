import Router from "express";
import { artProxy } from "../proxy/art.proxy";
import { authProxy } from "../proxy/auth.proxy";
import { userProxy } from "../proxy/user.proxy";
import { adminProxy } from "../proxy/admin.proxy";
import { walletProxy } from "../proxy/wallet.proxy";
import { uploadProxy } from "../proxy/upload.proxy";
import { notificationsProxy } from "../proxy/notifications.proxy";
import { elasticSearchProxy } from "../proxy/elastic-search.proxy";

const router = Router();

// user-admin-service
router.use("/api/v1/user", userProxy);
router.use("/api/v1/auth", authProxy);
router.use("/api/v1/admin", adminProxy);

// wallet-service
router.use("/api/v1/wallet", walletProxy)

// art-service
router.use("/api/v1/art", artProxy);

// notification-service
router.use("/api/v1/notifications", notificationsProxy);

// upload-service
router.use("/api/v1/upload", uploadProxy);

// elastic-search-service
router.use("/api/v1/elastic", elasticSearchProxy)

export default router;
