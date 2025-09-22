import { Router } from "express";
import { UserElasticController } from "../controller/userElastic.controller";
import { ElasticSearchController } from "../controller/elasticSearch.controller";

const router = Router();
const controller = new ElasticSearchController();
const userController = new UserElasticController()

// Unified search endpoint
router.get("/search", controller.search);
router.get("/admin/search", userController.adminSearchUsers);

export default router;
