import express from "express";
import { artController } from "../../infrastructure/container/artContainer";
import { commentController } from "../../infrastructure/container/commentContainer";
import { categoryController } from "../../infrastructure/container/categoryContainer";

const router = express.Router();

// Category
router.get("/category", categoryController.getCategory)
router.post("/category", categoryController.createCategory)
router.patch("/category/:id", categoryController.editCategory)

// Art
router.get("/", artController.getAllArt);
router.post("/", artController.createArt);
router.get("/by-name/:artname", artController.getArtByArtName);



// Comment
router.post("/comment", commentController.createComment);
router.get("/comments/:postId", commentController.getComments);
router.patch("/comment", commentController.editComment)
router.delete("/comment", commentController.deleteComment)

export default router;
