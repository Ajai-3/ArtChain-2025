import express from "express";
import { container } from "../../infrastructure/Inversify/inversify.config";
import { TYPES } from "../../infrastructure/Inversify/types";
import { ICommissionController } from "../interface/ICommissionController";
import { ROUTES } from "../../constants/routes";

const router = express.Router();

const commissionController = container.get<ICommissionController>(TYPES.ICommissionController);

router.post(
  ROUTES.COMMISSION.REQUEST,
  commissionController.requestCommission
);

router.get(
  ROUTES.COMMISSION.BY_CONVERSATION,
  commissionController.getCommissionByConversation
);

router.patch(
  ROUTES.COMMISSION.BY_ID,
  commissionController.updateCommission
);

export default router;
