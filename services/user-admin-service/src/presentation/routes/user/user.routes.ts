import express from 'express';
import { UserController } from '../../controllers/user/UserController';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user/UserRepositoryImpl';
import { SupporterRepositoryImpl } from './../../../infrastructure/repositories/user/SupporterRepositoryIml';

const router = express.Router();

const userRepo = new UserRepositoryImpl();
const suppoterRepo = new SupporterRepositoryImpl()
const userController = new UserController(userRepo, suppoterRepo);

router.get('/profile', userController.getUserProfile);
router.get('/profile/:userId', userController.getUserProfileWithId);

// router.post('/support')

export default router;