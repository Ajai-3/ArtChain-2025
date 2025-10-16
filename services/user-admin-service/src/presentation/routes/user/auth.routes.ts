import express from 'express';
import { TYPES } from '../../../infrastructure/inversify/types';
import { container } from '../../../infrastructure/inversify/inversify.config';
import { IUserAuthController } from '../../interfaces/user/IUserAuthController';

const router = express.Router();

const userAuthController = container.get<IUserAuthController>(
  TYPES.IUserAuthController
);

router.post('/start-register', userAuthController.startRegister);
router.post('/register', userAuthController.registerUser);

router.post('/login', userAuthController.loginUser);
router.post('/google-auth', userAuthController.googleAuthUser);

router.post('/forgot-password', userAuthController.forgotPassword);
router.patch('/reset-password', userAuthController.resetPassword);

router.get('/refresh-token', userAuthController.refreshToken);
router.post('/logout', userAuthController.logoutUser);

export default router;
