import express from 'express';

import { IArtController } from '../interface/IArtController';
import { TYPES } from '../../infrastructure/Inversify/types';
import { ILikeController } from '../interface/ILikeController';
import { IShopController } from '../interface/IShopController';
import { ICommentController } from '../interface/ICommentController';
import { IFavoriteController } from '../interface/IFavoriteController';
import { ICategoryController } from '../interface/ICategoryController';
import { IAdminPlatformConfigController } from '../interface/IAdminPlatformConfigController';
import { container } from '../../infrastructure/Inversify/inversify.config';
import { ROUTES } from '../../constants/routes';

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

const adminConfigController = container.get<IAdminPlatformConfigController>(
  TYPES.IAdminPlatformConfigController
);

// Category
router.get(ROUTES.CATEGORY.BASE, categoryController.getCategory);
router.post(ROUTES.CATEGORY.BASE, categoryController.createCategory);
router.patch(ROUTES.CATEGORY.BY_ID, categoryController.editCategory);

// Shop
router.get(ROUTES.SHOP.BASE, shopController.getAllShopItems);
router.get(ROUTES.SHOP.BY_USER_ID, shopController.getShopItemsByUser);

// Platform Config (Public) -
router.get(ROUTES.CONFIG.BASE, adminConfigController.getConfig);

// Art
router.get(ROUTES.ART.BASE, artController.getAllArt);
router.post(ROUTES.ART.BASE, artController.createArt);
router.get(ROUTES.ART.BY_USER_ID, artController.getArtWithUser);
router.get(ROUTES.ART.COUNT, artController.countArtwork);
router.get(ROUTES.ART.BY_ART_NAME, artController.getArtByArtName);
router.get(ROUTES.ART.RECOMMENDED, artController.getRecommendedArt);
router.post(ROUTES.ART.BUY, artController.buyArt);
router.get(ROUTES.ART.DOWNLOAD, artController.downloadArt);
router.get(ROUTES.ART.SALED, artController.saledArtWorks);
router.get(ROUTES.ART.SALES_ANALYTICS, artController.salesAnalytics);
router.get(ROUTES.ART.PURCHASED, artController.purchasedArtWorks);
router.get(ROUTES.ART.PURCHASE_ANALYTICS, artController.purchaseAnalytics);
router.get(ROUTES.ART.BY_ID, artController.getArtById);
router.patch(ROUTES.ART.BY_ID, artController.updateArt);
router.delete(ROUTES.ART.BY_ID, artController.deleteArt);

// Comment
router.put(ROUTES.COMMENT.EDIT, commentController.editComment);
router.post(ROUTES.COMMENT.BASE, commentController.createComment);
router.delete(ROUTES.COMMENT.EDIT, commentController.deleteComment);
router.get(ROUTES.COMMENT.COMMENTS_BY_POST_ID, commentController.getComments);
router.get(ROUTES.COMMENT.BY_ID, commentController.getCommentById);

// Likes
router.post(ROUTES.LIKE.BASE, likeController.likePost);
router.delete(ROUTES.LIKE.UNLIKE, likeController.unlikePost);
router.get(ROUTES.LIKE.LIKES_BY_POST_ID, likeController.getLikedUsers);
router.get(ROUTES.LIKE.LIKES_COUNT_BY_POST_ID, likeController.getLikeCount);
router.get(ROUTES.LIKE.LIKED_ARTS, likeController.getUserLikedArts);

// Favorites
router.post(ROUTES.FAVORITE.BASE, favoriteController.addFavorite);
router.delete(ROUTES.FAVORITE.UNFAVORITE, favoriteController.removeFavorite);
router.get(ROUTES.FAVORITE.FAVORITES_BY_POST_ID, favoriteController.getFavoritedUsers);
router.get(ROUTES.FAVORITE.FAVORITES_COUNT_BY_POST_ID, favoriteController.getFavoriteCount);
router.get(ROUTES.FAVORITE.FAVORITES_BY_USER_ID, favoriteController.getUserFavoritedArts);




export default router;
