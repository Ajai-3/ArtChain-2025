import express from 'express';
import { AuthController } from '../../controllers/user/UserAuthController';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user/UserRepositoryImpl';

const router = express.Router();

const userRepo = new UserRepositoryImpl();
const authController = new AuthController(userRepo);

router.post('/start-register', authController.startRegister);
router.post('/register', authController.registerUser);

router.post('/google-auth', authController.googleAuthUser);

router.patch('/forgot-password', authController.forgotPassword);

router.patch('/change-password/:userId', authController.changePassword);

router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

export default router;