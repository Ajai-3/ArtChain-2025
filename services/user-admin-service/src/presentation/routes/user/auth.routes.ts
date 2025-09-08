import express from 'express';

import { userAuthController } from './../../../infrastructure/container/user/userAuthContainer';

const router = express.Router();

router.post('/start-register', userAuthController.startRegister);
router.post('/register', userAuthController.registerUser);

router.post('/login', userAuthController.loginUser);
router.post('/google-auth', userAuthController.googleAuthUser);

router.post('/forgot-password', userAuthController.forgotPassword);
router.patch('/reset-password', userAuthController.resetPassword);

router.get('/refresh-token', userAuthController.refreshToken);
router.post('/logout', userAuthController.logoutUser);

export default router;
