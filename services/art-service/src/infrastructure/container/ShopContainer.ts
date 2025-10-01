import { GetShopArtsByUserUseCase } from './../../application/usecase/art/GetShopArtsByUserUseCase';
import { GetAllShopArtsUseCase } from './../../application/usecase/art/GetAllShopArtsUseCase';
import { ShopController } from "../../presentation/controllers/ShopController";
import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";
import { FavoriteRepositoryImpl } from "../repositories/FavoriteRepositoryImpl";

// Repositories
const artRepo = new ArtPostRepositoryImpl()
const favoriteRepo = new FavoriteRepositoryImpl()

// Use cases
const getAllShopArtsUseCase = new GetAllShopArtsUseCase(artRepo, favoriteRepo)
const getShopArtsByUserUseCase = new GetShopArtsByUserUseCase(artRepo, favoriteRepo)

// Controller
export const shopController = new ShopController(getAllShopArtsUseCase, getShopArtsByUserUseCase)