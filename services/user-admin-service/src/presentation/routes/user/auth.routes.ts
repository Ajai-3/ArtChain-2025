import express from 'express';
import { AuthController } from '../../controllers/user/UserAuthController';

const router = express.Router();

const authController = new AuthController();

router.post('/start-register', authController.startRegister);
router.post('/register', authController.registerUser);

router.post('/google-auth', authController.googleAuthUser);

router.patch('/forgot-password', authController.forgotPassword);

router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

export default router;