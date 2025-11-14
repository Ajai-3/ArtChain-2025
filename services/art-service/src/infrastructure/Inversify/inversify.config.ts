import "reflect-metadata";
import { TYPES } from "./types";
import { Container } from "inversify";

// Repositories
import { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import { IArtPostRepository } from "../../domain/repositories/IArtPostRepository";
import { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { IFavoriteRepository } from "../../domain/repositories/IFavoriteRepository";

import { LikeRepositoryImpl } from "../repositories/LikeRepositoryImpl";
import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";
import { CommentRepositoryImpl } from "../repositories/CommentRepositoryImpl";
import { CategoryRepositoryImpl } from "../repositories/CategoryRepositoryImpl";
import { FavoriteRepositoryImpl } from "../repositories/FavoriteRepositoryImpl";

// Use Cases - Art
import { IGetAllArtUseCase } from "../../application/interface/usecase/art/IGetAllArtUseCase";
import { IGetArtByIdUseCase } from "../../application/interface/usecase/art/IGetArtByIdUseCase";
import { ICountArtWorkUseCase } from "../../application/interface/usecase/art/ICountArtWorkUseCase";
import { IGetArtByNameUseCase } from "../../application/interface/usecase/art/IGetArtByNameUseCase";
import { ICreateArtPostUseCase } from "../../application/interface/usecase/art/ICreateArtPostUseCase";
import { IGetAllShopArtsUseCase } from "../../application/interface/usecase/art/IGetShopArtsByUserUseCase";
import { IGetShopArtsByUserUseCase } from "../../application/interface/usecase/art/IGetAllShopArtsUseCase";
import { IArtToElasticSearchUseCase } from "../../application/interface/usecase/art/IArtToElasticSearchUseCase";
import { IGetAllArtWithUserIdUseCase } from "../../application/interface/usecase/art/IGetAllArtWithUserIdUseCase";

import { GetAllArtUseCase } from "../../application/usecase/art/GetAllArtUseCase";
import { GetArtByIdUseCase } from "../../application/usecase/art/GetArtByIdUseCase";
import { CountArtWorkUseCase } from "../../application/usecase/art/CountArtWorkUseCase";
import { GetArtByNameUseCase } from "../../application/usecase/art/GetArtByNameUseCase";
import { CreateArtPostUseCase } from "../../application/usecase/art/CreateArtPostUseCase";
import { GetAllShopArtsUseCase } from "../../application/usecase/art/GetAllShopArtsUseCase";
import { GetShopArtsByUserUseCase } from "../../application/usecase/art/GetShopArtsByUserUseCase";
import { ArtToElasticSearchUseCase } from "../../application/usecase/art/ArtToElasticSearchUseCase";
import { GetAllArtWithUserIdUseCase } from "../../application/usecase/art/GetAllArtWithUserIdUseCase";

// Use Cases - Category
import { IEditCategoryUseCase } from "../../application/interface/usecase/category/IEditCategoryUseCase";
import { ICreateCategoryUseCase } from "../../application/interface/usecase/category/ICreateCategoryUseCase";
import { IGetAllCategoryUseCase } from "../../application/interface/usecase/category/IGetAllCategoryUseCase";

import { EditCategoryUseCase } from "../../application/usecase/category/EditCategoryUseCase";
import { CreateCategoryUseCase } from "../../application/usecase/category/CreateCategoryUseCase";
import { GetAllCategoryUseCase } from "../../application/usecase/category/GetAllCategoryUseCase";

// Use Cases - Comment
import { IGetCommentsUseCase } from "../../application/interface/usecase/comment/IGetCommentsUseCase";
import { ICreateCommentUseCase } from "../../application/interface/usecase/comment/ICreateCommentUseCase";

import { GetCommentsUseCase } from "../../application/usecase/comment/GetCommentsUseCase";
import { CreateCommentUseCase } from "../../application/usecase/comment/CreateCommentUseCase";

// Use Cases - Favorite
import { IAddFavoriteUseCase } from "../../application/interface/usecase/favorite/IAddFavoriteUseCase";
import { IRemoveFavoriteUseCase } from "../../application/interface/usecase/favorite/IRemoveFavoriteUseCase";
import { IGetFavoriteCountUseCase } from "../../application/interface/usecase/favorite/IGetFavoriteCountUseCase";
import { IGetFavoritedUsersUseCase } from "../../application/interface/usecase/favorite/IGetFavoritedUsersUseCase";
import { IGetUserFavoritedArtsUseCase } from "../../application/interface/usecase/favorite/IGetUserFavoritedArtsUseCase";

import { AddFavoriteUseCase } from "../../application/usecase/favorite/AddFavoriteUseCase";
import { RemoveFavoriteUseCase } from "../../application/usecase/favorite/RemoveFavoriteUseCase";
import { GetFavoriteCountUseCase } from "../../application/usecase/favorite/GetFavoriteCountUseCase";
import { GetFavoritedUsersUseCase } from "../../application/usecase/favorite/GetFavoritedUsersUseCase";
import { GetUserFavoritedArtsUseCase } from "../../application/usecase/favorite/GetUserFavoritedArtsUseCase";

// Use Cases - Like
import { ILikePostUseCase } from "../../application/interface/usecase/like/ILikePostUseCase";
import { IUnlikePostUseCase } from "../../application/interface/usecase/like/IUnlikePostUseCase";
import { IGetLikeCountUseCase } from "../../application/interface/usecase/like/IGetLikeCountUseCase";
import { IGetLikedUsersUseCase } from "../../application/interface/usecase/like/IGetLikedUsersUseCase";

import { LikePostUseCase } from "../../application/usecase/like/LikePostUseCase";
import { UnlikePostUseCase } from "../../application/usecase/like/UnlikePostUseCase";
import { GetLikeCountUseCase } from "../../application/usecase/like/GetLikeCountUseCase";
import { GetLikedUsersUseCase } from "../../application/usecase/like/GetLikedUsersUseCase";

// Controllers
import { IArtController } from "../../presentation/interface/IArtController";
import { IShopController } from "../../presentation/interface/IShopController";
import { ILikeController } from "../../presentation/interface/ILikeController";
import { ICommentController } from "../../presentation/interface/ICommentController";
import { IFavoriteController } from "../../presentation/interface/IFavoriteController";
import { ICategoryController } from "../../presentation/interface/ICategoryController";

import { ArtController } from "../../presentation/controllers/ArtController";
import { ShopController } from "../../presentation/controllers/ShopController";
import { LikeController } from "../../presentation/controllers/LikeController";
import { CommentController } from "../../presentation/controllers/CommentController";
import { FavoriteController } from "../../presentation/controllers/FavoriteController";
import { CategoryController } from "../../presentation/controllers/CategoryController";

const container = new Container();

// Repositories
container.bind<ILikeRepository>(TYPES.ILikeRepository).to(LikeRepositoryImpl);
container
  .bind<IArtPostRepository>(TYPES.IArtPostRepository)
  .to(ArtPostRepositoryImpl);
container
  .bind<ICommentRepository>(TYPES.ICommentRepository)
  .to(CommentRepositoryImpl);
container
  .bind<ICategoryRepository>(TYPES.ICategoryRepository)
  .to(CategoryRepositoryImpl);
container
  .bind<IFavoriteRepository>(TYPES.IFavoriteRepository)
  .to(FavoriteRepositoryImpl);

// Use Cases - Art
container.bind<IGetAllArtUseCase>(TYPES.IGetAllArtUseCase).to(GetAllArtUseCase);
container
  .bind<IGetArtByIdUseCase>(TYPES.IGetArtByIdUseCase)
  .to(GetArtByIdUseCase);
container
  .bind<ICountArtWorkUseCase>(TYPES.ICountArtWorkUseCase)
  .to(CountArtWorkUseCase);
container
  .bind<IGetArtByNameUseCase>(TYPES.IGetArtByNameUseCase)
  .to(GetArtByNameUseCase);
container
  .bind<ICreateArtPostUseCase>(TYPES.ICreateArtPostUseCase)
  .to(CreateArtPostUseCase);
container
  .bind<IGetAllShopArtsUseCase>(TYPES.IGetAllShopArtsUseCase)
  .to(GetAllShopArtsUseCase);
container
  .bind<IGetShopArtsByUserUseCase>(TYPES.IGetShopArtsByUserUseCase)
  .to(GetShopArtsByUserUseCase);
container
  .bind<IArtToElasticSearchUseCase>(TYPES.IArtToElasticSearchUseCase)
  .to(ArtToElasticSearchUseCase);
container
  .bind<IGetAllArtWithUserIdUseCase>(TYPES.IGetAllArtWithUserIdUseCase)
  .to(GetAllArtWithUserIdUseCase);

// Use Cases - Category
container
  .bind<IEditCategoryUseCase>(TYPES.IEditCategoryUseCase)
  .to(EditCategoryUseCase);
container
  .bind<ICreateCategoryUseCase>(TYPES.ICreateCategoryUseCase)
  .to(CreateCategoryUseCase);
container
  .bind<IGetAllCategoryUseCase>(TYPES.IGetAllCategoryUseCase)
  .to(GetAllCategoryUseCase);

// Use Cases - Comment
container
  .bind<IGetCommentsUseCase>(TYPES.IGetCommentsUseCase)
  .to(GetCommentsUseCase);
container
  .bind<ICreateCommentUseCase>(TYPES.ICreateCommentUseCase)
  .to(CreateCommentUseCase);

// Use Cases - Favorite
container
  .bind<IAddFavoriteUseCase>(TYPES.IAddFavoriteUseCase)
  .to(AddFavoriteUseCase);
container
  .bind<IRemoveFavoriteUseCase>(TYPES.IRemoveFavoriteUseCase)
  .to(RemoveFavoriteUseCase);
container
  .bind<IGetFavoriteCountUseCase>(TYPES.IGetFavoriteCountUseCase)
  .to(GetFavoriteCountUseCase);
container
  .bind<IGetFavoritedUsersUseCase>(TYPES.IGetFavoritedUsersUseCase)
  .to(GetFavoritedUsersUseCase);
container
  .bind<IGetUserFavoritedArtsUseCase>(TYPES.IGetUserFavoritedArtsUseCase)
  .to(GetUserFavoritedArtsUseCase);

// Use Cases - Like
container.bind<ILikePostUseCase>(TYPES.ILikePostUseCase).to(LikePostUseCase);
container
  .bind<IUnlikePostUseCase>(TYPES.IUnlikePostUseCase)
  .to(UnlikePostUseCase);
container
  .bind<IGetLikeCountUseCase>(TYPES.IGetLikeCountUseCase)
  .to(GetLikeCountUseCase);
container
  .bind<IGetLikedUsersUseCase>(TYPES.IGetLikedUsersUseCase)
  .to(GetLikedUsersUseCase);

// Controllers
container.bind<IArtController>(TYPES.IArtController).to(ArtController);
container.bind<IShopController>(TYPES.IShopController).to(ShopController);
container.bind<ILikeController>(TYPES.ILikeController).to(LikeController);
container
  .bind<ICommentController>(TYPES.ICommentController)
  .to(CommentController);
container
  .bind<IFavoriteController>(TYPES.IFavoriteController)
  .to(FavoriteController);
container
  .bind<ICategoryController>(TYPES.ICategoryController)
  .to(CategoryController);

export { container };
