import { AddFavoriteUseCase } from "../../application/usecase/favorite/AddFavoriteUseCase";
import { RemoveFavoriteUseCase } from "../../application/usecase/favorite/RemoveFavoriteUseCase";
import { GetFavoriteCountUseCase } from "../../application/usecase/favorite/GetFavoriteCountUseCase";
import { GetFavoritedUsersUseCase } from "../../application/usecase/favorite/GetFavoritedUsersUseCase";
import { FavoriteController } from "../../presentation/controllers/FavoriteController";
import { FavoriteRepositoryImpl } from "../repositories/FavoriteRepositoryImpl";
import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";
import { GetUserFavoritedArtsUseCase } from "../../application/usecase/favorite/GetUserFavoritedArtsUseCase";
import { LikeRepositoryImpl } from "../repositories/LikeRepositoryImpl";
import { CommentRepositoryImpl } from "../repositories/CommentRepositoryImpl";

// Repositories
const likeRepo = new LikeRepositoryImpl();
const artRepo = new ArtPostRepositoryImpl(); 
const commentRepo = new CommentRepositoryImpl();
const favoriteRepo = new FavoriteRepositoryImpl();

// Use cases
const addFavoriteUseCase = new AddFavoriteUseCase(artRepo, favoriteRepo);
const removeFavoriteUseCase = new RemoveFavoriteUseCase(favoriteRepo);
const getFavoriteCountUseCase = new GetFavoriteCountUseCase(favoriteRepo);
const getFavoritedUsersUseCase = new GetFavoritedUsersUseCase(favoriteRepo);
const getUserFavoritedArtsUseCase = new GetUserFavoritedArtsUseCase(likeRepo, artRepo, commentRepo, favoriteRepo)

// Controller
export const favoriteController = new FavoriteController(
  addFavoriteUseCase,
  removeFavoriteUseCase,
  getFavoriteCountUseCase,
  getFavoritedUsersUseCase,
  getUserFavoritedArtsUseCase
);
