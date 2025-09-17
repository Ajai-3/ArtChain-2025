import { Router } from "express";
import { UserElasticController } from "../controller/userElastic.controller";

const router = Router();
const controller = new UserElasticController();

router.post("/", controller.indexUser);
router.patch("/", controller.updateUser)
router.get("/search", controller.searchUsers);
router.get("/admin/search", controller.adminSearchUsers);

export default router;
