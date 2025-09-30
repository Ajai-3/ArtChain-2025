import express from "express";
import { artController } from "../../infrastructure/container/artContainer";
import { commentController } from "../../infrastructure/container/commentContainer";
import { categoryController } from "../../infrastructure/container/categoryContainer";
import { likeController } from "../../infrastructure/container/likeContainer";
import { favoriteController } from "../../infrastructure/container/favoriteContainer";

const router = express.Router();

// Category
router.get("/category", categoryController.getCategory);
router.post("/category", categoryController.createCategory);
router.patch("/category/:id", categoryController.editCategory);

// Art
router.get("/", artController.getAllArt);
router.post("/", artController.createArt);
router.get("/user", artController.getArtWithUser);
router.get("/count/:userId", artController.countArtwork);
router.get("/by-name/:artname", artController.getArtByArtName);

// Comment
router.patch("/comment", commentController.editComment);
router.post("/comment", commentController.createComment);
router.delete("/comment", commentController.deleteComment);
router.get("/comments/:postId", commentController.getComments);

// Likes
router.post("/like", likeController.likePost);
router.delete("/unlike", likeController.unlikePost);
router.get("/likes/:postId", likeController.getLikedUsers);
router.get("/likes-count/:postId", likeController.getLikeCount);

// Favorites
router.post("/favorite", favoriteController.addFavorite);
router.delete("/unfavorite", favoriteController.removeFavorite);
router.get("/favorites/:postId", favoriteController.getFavoritedUsers);
router.get("/favorites-count/:postId", favoriteController.getFavoriteCount);


export default router;
