import express from "express";

import { userController } from "../../../infrastructure/container/user/userContainer";
import { artistRequestController } from "../../../infrastructure/container/user/artistRequestContainer";

const router = express.Router();

router.get("/profile", userController.getUserProfile);
router.get("/profile/:userId", userController.getUserProfileWithId);

router.post("/support/:userId", userController.supportUser);
router.delete("/un-support/:userId", userController.unSupportUser);

router.post("/artist-request", artistRequestController.createArtistRequest);
router.get(
  "/artist-request/status",
  artistRequestController.hasUserSubmittedRequest
);

export default router;
