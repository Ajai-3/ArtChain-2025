import Router from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { s3Proxy } from '../proxy/S3.proxy';
import { artProxy } from '../proxy/art.proxy';
import { authProxy } from '../proxy/auth.proxy';
import { userProxy } from '../proxy/user.proxy';
import { chatProxy } from '../proxy/chat.proxy';
import { adminProxy } from '../proxy/admin.proxy';
import { walletProxy } from '../proxy/wallet.proxy';
import { notificationsProxy } from '../proxy/notifications.proxy';
import { elasticSearchProxy } from '../proxy/elastic-search.proxy';
import { ROUTES } from '../constants/routes';

const router = Router();

// user-admin-service
router.use(ROUTES.USER.BASE, userProxy);
router.use(ROUTES.AUTH.BASE, authProxy);
router.use(ROUTES.ADMIN.BASE, adminProxy);

// wallet-service
router.use(ROUTES.WALLET.BASE, walletProxy);

// art-service
router.use(ROUTES.ART.BASE, artProxy);

// notification-service
router.use(ROUTES.NOTIFICATIONS.BASE, notificationsProxy);

// upload-service
router.use(ROUTES.UPLOAD.BASE, s3Proxy);

// elastic-search-service
router.use(ROUTES.ELASTIC.BASE, elasticSearchProxy);

// chat-service
router.use(ROUTES.CHAT.BASE, chatProxy);

export default router;

