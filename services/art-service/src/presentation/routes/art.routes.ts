import express from "express";
import { artController } from "../../infrastructure/container/artContainer";
import { commentController } from "../../infrastructure/container/commentContainer";

const router = express.Router();

// Art
router.post("/", artController.createArt)
router.get("/:id", artController.getArtById)
// router.get("/:artname", artController.getArtByArtName)
router.get("/", artController.getAllArt)

// Comment
router.post("/comment", commentController.createComment)
router.get("/comments/:postId", commentController.getComments)


export default router;