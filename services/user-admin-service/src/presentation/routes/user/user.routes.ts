import express from 'express';
import { UserController } from '../../controllers/user/UserController';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user/UserRepositoryImpl';

const router = express.Router();

const userRepo = new UserRepositoryImpl();
const userController = new UserController(userRepo);

router.get('/profile', userController.getUserProfile);
router.get('/profile:id', userController.getUserProfileWithId);

// router.post('/support')

export default router;