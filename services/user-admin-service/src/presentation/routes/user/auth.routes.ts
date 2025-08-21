import express from "express";

import { userAuthController } from './../../../infrastructure/container/user/userAuthContainer';

const router = express.Router();



router.post("/start-register", userAuthController.startRegister);
router.post("/register", userAuthController.registerUser);

router.post("/login", userAuthController.loginUser);
router.post("/google-auth", userAuthController.googleAuthUser);

router.post("/forgot-password", userAuthController.forgotPassword);
router.patch("/reset-password", userAuthController.resetPassword);
router.patch("/change-password", userAuthController.changePassword);

router.get("/refresh-token", userAuthController.refreshToken);
router.post("/logout", userAuthController.logoutUser);

// import { AddUserToElasticSearchUseCase } from "../../../application/usecases/user/search/AddUserToElasticSearchUseCase";
// const addUserToElasticUseCase = new AddUserToElasticSearchUseCase();
export default router;
