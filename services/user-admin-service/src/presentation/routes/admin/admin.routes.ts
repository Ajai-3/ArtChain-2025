import express from "express";
import { TYPES } from "../../../infrastructure/inversify/types";
import { container } from "../../../infrastructure/inversify/inversify.config";
import { IAdminAuthController } from "../../interfaces/admin/IAdminAuthController";
import { IUserManageMentController } from "../../interfaces/admin/IUserManagementController";

const adminAuthController = container.get<IAdminAuthController>(
  TYPES.IAdminAuthController
);
const userManageMentController = container.get<IUserManageMentController>(
  TYPES.IUserManageMentController
);

const router = express.Router();

// Admin Auth Routes
router.post("/login", adminAuthController.adminLogin);
router.post("/logout", adminAuthController.adminLogout);

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
router.patch(
  "/artist-request/:id/approve",
  userManageMentController.approveArtistRequest
);
router.patch(
  "/artist-request/:id/reject",
  userManageMentController.rejectArtistRequest
);

export default router;
