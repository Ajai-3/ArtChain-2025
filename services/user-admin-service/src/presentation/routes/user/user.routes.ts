import express from "express";

import { userController } from "../../../infrastructure/container/user/userContainer";
import { artistRequestController } from "../../../infrastructure/container/user/artistRequestContainer";
import { securityController } from "../../../infrastructure/container/user/securityContainer";

const router = express.Router();

router.get("/profile/:username", userController.getProfile);
router.get("/profile-id/:userId", userController.getUserProfileWithId);
router.patch("/profile", userController.updateProfile);

router.post("/support/:userId", userController.supportUser);
router.delete("/un-support/:userId", userController.unSupportUser);
router.delete("/remove/:supporterId", userController.removeSupporter)

router.post("/artist-request", artistRequestController.createArtistRequest);
router.get(
  "/artist-request/status",
  artistRequestController.hasUserSubmittedRequest
);

// Change password
router.post("/change-password", securityController.changePassword);
// Change Email
router.post("/change-email", securityController.changeEmail);
router.post("/verify-email-token", securityController.emailVerifyToken);
// Deactivate Account
router.post("/deactivate", securityController.deactivateAccount);

router.get("/:id/supporters", userController.getSupporters);
router.get("/:id/supporting", userController.getSupporing);

router.post("/batch", userController.getAllUserWithIds);

export default router;
