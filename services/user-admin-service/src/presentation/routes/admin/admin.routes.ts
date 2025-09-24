import express from "express";
import { adminAuthController } from "../../../infrastructure/container/admin/adminAuthContainer";
import { userManageMentController } from "../../../infrastructure/container/admin/userManagementContainer";

const router = express.Router();

// Admin Auth routes
router.post("/login", adminAuthController.adminLogin);
router.post("/logout", adminAuthController.adminLogout);
router.get("/refresh-token", adminAuthController.refreshToken);

// User Management Routes
router.get("/users", userManageMentController.getAllUsers);
router.patch(
  "/users/:userId/ban-toggle",
  userManageMentController.banOrUnbanUser
);
router.get(
  "/get-artist-requests",
  userManageMentController.getAllArtistRequests
);
router.patch("/artist-request/:id/approve", userManageMentController.approveArtistRequest)
router.patch("/artist-request/:id/reject", userManageMentController.rejectArtistRequest)

export default router;
