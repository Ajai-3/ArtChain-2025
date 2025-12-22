import express from "express";
import { container } from "../../infrastructure/Inversify/inversify.config";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAdminPlatformConfigController } from "../interface/IAdminPlatformConfigController";

import { ROUTES } from "../../constants/routes";

const router = express.Router();

const controller = container.get<IAdminPlatformConfigController>(
  TYPES.IAdminPlatformConfigController
);

router.get(ROUTES.ADMIN_CONFIG.BASE, controller.getConfig.bind(controller));
router.patch(ROUTES.ADMIN_CONFIG.BASE, controller.updateConfig.bind(controller));

export default router;
