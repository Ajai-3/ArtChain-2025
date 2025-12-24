import express from "express";
import { container } from "../../infrastructure/Inversify/inversify.config";
import { AdminCommissionController } from "../controllers/AdminCommissionController";
import { ROUTES } from "../../constants/routes";

const router = express.Router();
const controller = container.get<AdminCommissionController>(AdminCommissionController);

router.get(ROUTES.ADMIN_COMMISSION.BASE + ROUTES.ADMIN_COMMISSION.ALL, controller.getAllCommissions);
router.get(ROUTES.ADMIN_COMMISSION.BASE + ROUTES.ADMIN_COMMISSION.STATS, controller.getStats);
router.get(ROUTES.ADMIN_COMMISSION.BASE + ROUTES.ADMIN_COMMISSION.RECENT, controller.getRecentCommissions);
router.post(ROUTES.ADMIN_COMMISSION.BASE + ROUTES.ADMIN_COMMISSION.RESOLVE, controller.resolveDispute);

export default router;
