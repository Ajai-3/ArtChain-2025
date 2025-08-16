import express from 'express';
import { AdminAuthController } from '../../controllers/admin/AdminAuthController';
import { AdminRepositoryImpl } from '../../../infrastructure/repositories/admin/AdminRepositoryImpl';

const router = express.Router();

const adminRepo = new AdminRepositoryImpl();
const adminAuthController = new AdminAuthController(adminRepo);

// Admin Auth routes
router.post('/login', adminAuthController.adminLogin);
router.post('/logout', adminAuthController.adminLogout);

// User Management Routes

export default router;