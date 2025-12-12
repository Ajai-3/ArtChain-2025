import express from "express";
import { container } from "../../infrastructure/Inversify/inversify.config";
import { TYPES } from "../../infrastructure/Inversify/types";
import { ROUTES } from "../../constants/routes";
import { IAIController } from "../interface/IAIController";

const router = express.Router();

const aiController = container.get<IAIController>(TYPES.IAIController);

// User AI routes
router.post(ROUTES.AI.GENERATE, aiController.generateImage);
router.get(ROUTES.AI.GENERATIONS, aiController.getMyGenerations);
router.get(ROUTES.AI.QUOTA, aiController.checkQuota);
router.get(ROUTES.AI.CONFIG, aiController.getEnabledConfigs);

export default router;
