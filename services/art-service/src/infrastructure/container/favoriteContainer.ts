import { AddFavoriteUseCase } from "../../application/usecase/favorite/AddFavoriteUseCase";
import { RemoveFavoriteUseCase } from "../../application/usecase/favorite/RemoveFavoriteUseCase";
import { GetFavoriteCountUseCase } from "../../application/usecase/favorite/GetFavoriteCountUseCase";
import { GetFavoritedUsersUseCase } from "../../application/usecase/favorite/GetFavoritedUsersUseCase";
import { FavoriteController } from "../../presentation/controllers/FavoriteController";
import { FavoriteRepositoryImpl } from "../repositories/FavoriteRepositoryImpl";
import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";

// Repositories
const artRepo = new ArtPostRepositoryImpl(); 
const favoriteRepo = new FavoriteRepositoryImpl();

// Use cases
const addFavoriteUseCase = new AddFavoriteUseCase(artRepo, favoriteRepo);
const removeFavoriteUseCase = new RemoveFavoriteUseCase(favoriteRepo);
const getFavoriteCountUseCase = new GetFavoriteCountUseCase(favoriteRepo);
const getFavoritedUsersUseCase = new GetFavoritedUsersUseCase(favoriteRepo);

// Controller
export const favoriteController = new FavoriteController(
  addFavoriteUseCase,
  removeFavoriteUseCase,
  getFavoriteCountUseCase,
  getFavoritedUsersUseCase
);
