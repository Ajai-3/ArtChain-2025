import express from 'express';
import { TYPES } from '../../../infrastructure/inversify/types';
import { container } from '../../../infrastructure/inversify/inversify.config';
import { IAdminAuthController } from '../../interfaces/admin/IAdminAuthController';
import { IUserManageMentController } from '../../interfaces/admin/IUserManagementController';
import { IAdminReportController } from '../../interfaces/admin/IAdminReportController';
import { ROUTES } from '../../../constants/routes';

const adminAuthController = container.get<IAdminAuthController>(
  TYPES.IAdminAuthController
);
const userManageMentController = container.get<IUserManageMentController>(
  TYPES.IUserManageMentController
);
const adminReportController = container.get<IAdminReportController>(
  TYPES.IAdminReportController
);

const router = express.Router();

// Admin Auth Routes
router.post(ROUTES.ADMIN.LOGIN, adminAuthController.adminLogin);
router.post(ROUTES.ADMIN.LOGOUT, adminAuthController.adminLogout);

// User Management Routes
router.get(ROUTES.ADMIN.USERS, userManageMentController.getAllUsers);
router.patch(
  ROUTES.ADMIN.USER_BAN_TOGGLE,
  userManageMentController.banOrUnbanUser
);
router.get(
  ROUTES.ADMIN.GET_ARTIST_REQUESTS,
  userManageMentController.getAllArtistRequests
);
router.patch(
  ROUTES.ADMIN.ARTIST_REQUEST_APPROVE,
  userManageMentController.approveArtistRequest
);
router.patch(
  ROUTES.ADMIN.ARTIST_REQUEST_REJECT,
  userManageMentController.rejectArtistRequest
);

// Report Routes
router.get(ROUTES.ADMIN.REPORTS, adminReportController.getAllReports);
router.get('/reports/grouped', adminReportController.getGroupedReports);
router.patch('/reports/bulk-status', adminReportController.updateReportStatusBulk);

export default router;
