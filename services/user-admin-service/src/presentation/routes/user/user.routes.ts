import express from 'express';

import { TYPES } from '../../../infrastructure/inversify/types';
import { container } from '../../../infrastructure/inversify/inversify.config';

import { IUserController } from '../../interfaces/user/IUserController';
import { ISecurityController } from '../../interfaces/user/ISecurityController';
import { IArtistRequestController } from './../../interfaces/user/IArtistRequestController';
import { IReportController } from '../../interfaces/user/IReportController';
import { ROUTES } from '../../../constants/routes';

const router = express.Router();

const userController = container.get<IUserController>(TYPES.IUserController);
const securityController = container.get<ISecurityController>(
  TYPES.ISecurityController
);
const artistRequestController = container.get<IArtistRequestController>(
  TYPES.IArtistRequestController
);
const reportController = container.get<IReportController>(TYPES.IReportController);

// User Controller Routes
router.patch(ROUTES.USER.PROFILE, userController.updateProfile);
router.post(ROUTES.USER.BATCH, userController.getAllUserWithIds);
router.get(ROUTES.USER.SUPPORTING, userController.getSupporing);
router.get(ROUTES.USER.SUPPORTERS, userController.getSupporters);
router.post(ROUTES.USER.SUPPORT, userController.supportUser);
router.get(ROUTES.USER.PROFILE_BY_USERNAME, userController.getProfile);
router.delete(ROUTES.USER.UNSUPPORT, userController.unSupportUser);
router.delete(ROUTES.USER.REMOVE_SUPPORTER, userController.removeSupporter);
router.get(ROUTES.USER.PROFILE_BY_ID, userController.getUserProfileWithId);
router.post(ROUTES.USER.REPORT, reportController.createReport);

// Artist Request Controller Routes
router.post(ROUTES.USER.ARTIST_REQUEST, artistRequestController.createArtistRequest);
router.get(
  ROUTES.USER.ARTIST_REQUEST_STATUS,
  artistRequestController.hasUserSubmittedRequest
);

// Security Controller Routes
router.post(ROUTES.USER.CHANGE_EMAIL, securityController.changeEmail);
router.post(ROUTES.USER.DEACTIVATE, securityController.deactivateAccount);
router.post(ROUTES.USER.CHANGE_PASSWORD, securityController.changePassword);
router.post(ROUTES.USER.VERIFY_EMAIL_TOKEN, securityController.emailVerifyToken);

export default router;
