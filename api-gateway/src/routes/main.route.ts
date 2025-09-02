import Router from "express";
import { artProxy } from "../proxy/art.proxy";
import { authProxy } from "../proxy/auth.proxy";
import { userProxy } from "../proxy/user.proxy";
import { adminProxy } from "../proxy/admin.proxy";
import { uploadProxy } from "../proxy/upload.proxy";
import { notificationsProxy } from "../proxy/notifications.proxy";

const router = Router();

// user-admin-service
router.use("/api/v1/user", userProxy);
router.use("/api/v1/auth", authProxy);
router.use("/api/v1/admin", adminProxy);

// art-service
router.use("/api/v1/art", artProxy);

// notification-service
router.use("/api/v1/notifications", notificationsProxy);

// upload-service
router.use("/api/v1/upload", uploadProxy);

export default router;
