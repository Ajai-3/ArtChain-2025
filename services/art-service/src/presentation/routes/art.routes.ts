import express from "express";
import { artController } from "../../infrastructure/container/artContainer";
import { commentController } from "../../infrastructure/container/commentContainer";

const router = express.Router();

// Art
router.post("/", artController.createArt)


// Comment
router.post("/comment", commentController.createComment)

export default router;