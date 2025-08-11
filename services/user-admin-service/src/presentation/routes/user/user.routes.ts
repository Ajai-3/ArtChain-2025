import express from 'express';
import { UserController } from '../../controllers/user/UserController';

const router = express.Router();

const userController = new UserController();

router.get('/profile', userController.getUserProfile);
router.get('/profile:id', userController.getUserProfileWithId);

export default router;