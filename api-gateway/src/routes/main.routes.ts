import Router from 'express';
import { userProxy } from '../services/user.proxy';
import { adminProxy } from '../services/admin.proxy';
import { artProxy } from '../services/art.proxy';
import { authProxy } from '../services/auth.proxy';

const router = Router();

router.use("/api/v1/user", userProxy);
router.use("/api/v1/admin", adminProxy);
router.use("/api/v1/art", artProxy);
router.use("/api/v1/auth", authProxy);

export default router;