import { Router } from "express";
import { container } from "../../infrastructure/Inversify/inversify.config";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IAdminArtController } from "../interface/IAdminArtController";

import { ROUTES } from "../../constants/routes";

const adminArtRouter = Router();
const adminArtController = container.get<IAdminArtController>(TYPES.IAdminArtController);

adminArtRouter.get(ROUTES.ADMIN_ART.BASE, adminArtController.getAllArts);
adminArtRouter.get(ROUTES.ADMIN_ART.BASE + ROUTES.ADMIN_ART.STATS, adminArtController.getArtStats);
adminArtRouter.patch(ROUTES.ADMIN_ART.BASE + ROUTES.ADMIN_ART.STATUS, adminArtController.updateArtStatus);

export default adminArtRouter;
