import express from 'express';
import { AdminAuthController } from '../../controllers/admin/AdminAuthController';

const router = express.Router();

const adminAuthController = new AdminAuthController();

router.post('/login', adminAuthController.adminLogin);
router.post('/logout', adminAuthController.adminLogout);

export default router;