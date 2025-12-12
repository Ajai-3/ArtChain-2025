import express from "express";
import { container } from "../../infrastructure/Inversify/inversify.config";
import { TYPES } from "../../infrastructure/Inversify/types";
import { ROUTES } from "../../constants/routes";
import { IAdminAIController } from "../interface/IAdminAIController";

const router = express.Router();

const adminAIController = container.get<IAdminAIController>(TYPES.IAdminAIController);

// Admin AI routes
router.get(ROUTES.ADMIN_AI.CONFIG, adminAIController.getConfigs);
router.put(ROUTES.ADMIN_AI.CONFIG, adminAIController.updateConfig);
router.post(ROUTES.ADMIN_AI.TEST_PROVIDER, adminAIController.testProvider);
router.get(ROUTES.ADMIN_AI.ANALYTICS, adminAIController.getAnalytics);

export default router;
