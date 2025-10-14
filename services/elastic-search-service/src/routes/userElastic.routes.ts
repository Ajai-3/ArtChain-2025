import { Router } from "express";
import { TYPES } from "../invectify/types";
import { container } from "../invectify/invectify.config";
import { IUserElasticController } from "../interface/IUserElasticController";
import { IElasticSearchController } from "../interface/IElasticSearchController";

const router = Router();

const UserElasticController = container.get<IUserElasticController>(
  TYPES.IUserElasticController
);
const elasticSearchController = container.get<IElasticSearchController>(
  TYPES.IElasticSearchController
);

// Unified search endpoint
router.get("/search", elasticSearchController.search);
router.get("/admin/search", UserElasticController.adminSearchUsers);

export default router;
