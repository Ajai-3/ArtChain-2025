import express from "express";

import { IArtController } from "../interface/IArtController";
import { TYPES } from "../../infrastructure/invectify/types";
import { ILikeController } from "../interface/ILikeController";
import { IShopController } from "../interface/IShopController";
import { ICommentController } from "../interface/ICommentController";
import { IFavoriteController } from "../interface/IFavoriteController";
import { ICategoryController } from "../interface/ICategoryController";
import { container } from "../../infrastructure/invectify/inversify.config";

const router = express.Router();

const artController = container.get<IArtController>(TYPES.IArtController);
const likeController = container.get<ILikeController>(TYPES.ILikeController);
const shopController = container.get<IShopController>(TYPES.IShopController);
const categoryController = container.get<ICategoryController>(
  TYPES.ICategoryController
);
const commentController = container.get<ICommentController>(
  TYPES.ICommentController
);
const favoriteController = container.get<IFavoriteController>(
  TYPES.IFavoriteController
);

// Category
router.get("/category", categoryController.getCategory);
router.post("/category", categoryController.createCategory);
router.patch("/category/:id", categoryController.editCategory);

// Art
router.get("/", artController.getAllArt);
router.post("/", artController.createArt);
router.get("/user/:userId", artController.getArtWithUser);
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
router.get("/favorites/user/:userId", favoriteController.getUserFavoritedArts);

// Shop
router.get("/shop", shopController.getAllShopItems);
router.get("/shop/:userId", shopController.getShopItemsByUser);

export default router;
