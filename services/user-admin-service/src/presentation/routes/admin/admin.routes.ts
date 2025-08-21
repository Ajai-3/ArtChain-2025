import { UserManageMentController } from './../../controllers/admin/UserManagementController';
import express from 'express';
import { AdminAuthController } from '../../controllers/admin/AdminAuthController';
import { AdminRepositoryImpl } from '../../../infrastructure/repositories/admin/AdminRepositoryImpl';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user/UserRepositoryImpl';

const router = express.Router();

const adminRepo = new AdminRepositoryImpl();
const adminAuthController = new AdminAuthController(adminRepo);

const userRepo = new UserRepositoryImpl();
const userManageMentController = new UserManageMentController(userRepo);

// Admin Auth routes
router.post('/login', adminAuthController.adminLogin);
router.post('/logout', adminAuthController.adminLogout);




// User Management Routes
router.get('/users', userManageMentController.getAllUsers);
router.patch('/users/:userId/ban-toggle', userManageMentController.banOrUnbanUser);


export default router;