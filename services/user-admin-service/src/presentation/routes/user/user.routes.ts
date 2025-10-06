import express from "express";

import { userController } from "../../../infrastructure/container/user/userContainer";
import { securityController } from "../../../infrastructure/container/user/securityContainer";
import { artistRequestController } from "../../../infrastructure/container/user/artistRequestContainer";

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

router.post("/change-email", securityController.changeEmail);
router.post("/deactivate", securityController.deactivateAccount);
router.post("/change-password", securityController.changePassword);
router.post("/verify-email-token", securityController.emailVerifyToken);

router.get("/:id/supporting", userController.getSupporing);
router.get("/:id/supporters", userController.getSupporters);

router.post("/batch", userController.getAllUserWithIds);

export default router;
