import Router from 'express';
import { artProxy } from '../proxy/art.proxy';
import { authProxy } from '../proxy/auth.proxy';
import { userProxy } from '../proxy/user.proxy';
import { adminProxy } from '../proxy/admin.proxy';
import { uploadProxy } from '../proxy/upload.proxy';

const router = Router();

// user-admin-service
router.use("/api/v1/user", userProxy);
router.use("/api/v1/auth", authProxy);
router.use("/api/v1/admin", adminProxy);

// art-service
router.use("/api/v1/art", artProxy);

// upload-service
router.use("/api/v1/upload", uploadProxy)

export default router;