import express from 'express';
import { TYPES } from '../../../infrastructure/inversify/types';
import { container } from '../../../infrastructure/inversify/inversify.config';
import { IUserAuthController } from '../../interfaces/user/IUserAuthController';
import { ROUTES } from '../../../constants/routes';

const router = express.Router();

const userAuthController = container.get<IUserAuthController>(
  TYPES.IUserAuthController
);

router.post(ROUTES.AUTH.START_REGISTER, userAuthController.startRegister);
router.post(ROUTES.AUTH.REGISTER, userAuthController.registerUser);

router.post(ROUTES.AUTH.LOGIN, userAuthController.loginUser);
router.post(ROUTES.AUTH.GOOGLE_AUTH, userAuthController.googleAuthUser);

router.post(ROUTES.AUTH.FORGOT_PASSWORD, userAuthController.forgotPassword);
router.patch(ROUTES.AUTH.RESET_PASSWORD, userAuthController.resetPassword);

router.get(ROUTES.AUTH.REFRESH_TOKEN, userAuthController.refreshToken);
router.post(ROUTES.AUTH.LOGOUT, userAuthController.logoutUser);

export default router;
