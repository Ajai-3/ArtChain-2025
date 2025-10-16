import express from 'express';

import { TYPES } from '../../../infrastructure/inversify/types';
import { container } from '../../../infrastructure/inversify/inversify.config';

import { IUserController } from '../../interfaces/user/IUserController';
import { ISecurityController } from '../../interfaces/user/ISecurityController';
import { IArtistRequestController } from './../../interfaces/user/IArtistRequestController';

const router = express.Router();

const userController = container.get<IUserController>(TYPES.IUserController);
const securityController = container.get<ISecurityController>(
  TYPES.ISecurityController
);
const artistRequestController = container.get<IArtistRequestController>(
  TYPES.IArtistRequestController
);

// User Controller Routes
router.patch('/profile', userController.updateProfile);
router.post('/batch', userController.getAllUserWithIds);
router.get('/:id/supporting', userController.getSupporing);
router.get('/:id/supporters', userController.getSupporters);
router.post('/support/:userId', userController.supportUser);
router.get('/profile/:username', userController.getProfile);
router.delete('/un-support/:userId', userController.unSupportUser);
router.delete('/remove/:supporterId', userController.removeSupporter);
router.get('/profile-id/:userId', userController.getUserProfileWithId);

// Artist Request Controller Routes
router.post('/artist-request', artistRequestController.createArtistRequest);
router.get(
  '/artist-request/status',
  artistRequestController.hasUserSubmittedRequest
);

// Security Controller Routes
router.post('/change-email', securityController.changeEmail);
router.post('/deactivate', securityController.deactivateAccount);
router.post('/change-password', securityController.changePassword);
router.post('/verify-email-token', securityController.emailVerifyToken);

export default router;
