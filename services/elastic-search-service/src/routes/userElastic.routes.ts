import { Router } from "express";
import { TYPES } from "../Inversify/types";
import { container } from "../Inversify/Inversify.config";
import { IUserElasticController } from "../interface/IUserElasticController";
import { IElasticSearchController } from "../interface/IElasticSearchController";
import { IArtElasticController } from "../interface/IArtElasticController";

const router = Router();

const userElasticController = container.get<IUserElasticController>(
  TYPES.IUserElasticController
);
const artElasticController = container.get<IArtElasticController>(
  TYPES.IArtElasticController
);
const elasticSearchController = container.get<IElasticSearchController>(
  TYPES.IElasticSearchController
);

// Unified search endpoint
router.get("/search", elasticSearchController.search);
router.get("/admin/search", userElasticController.adminSearchUsers);
router.get("/admin/search/arts", artElasticController.adminSearchArts);

export default router;
