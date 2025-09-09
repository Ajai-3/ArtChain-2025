import express from "express";
import { artController } from "../../infrastructure/container/artContainer";

const router = express.Router();

router.post("/api/v1/art", artController.createArt)

export default router;