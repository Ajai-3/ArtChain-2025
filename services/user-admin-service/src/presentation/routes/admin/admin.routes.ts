import express from 'express';
import { adminAuthController } from '../../../infrastructure/container/admin/adminAuthContainer';
import { userManageMentController } from '../../../infrastructure/container/admin/userManagementContainer';


const router = express.Router();

// Admin Auth routes
router.post('/login', adminAuthController.adminLogin);
router.post('/logout', adminAuthController.adminLogout);

// User Management Routes
router.get('/users', userManageMentController.getAllUsers);
router.patch('/users/:userId/ban-toggle', userManageMentController.banOrUnbanUser);


export default router;