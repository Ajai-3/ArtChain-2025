import "reflect-metadata";
import { TYPES } from "./types";
import { Container } from "inversify";

const container = new Container();

// Repositories
import { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import { IArtPostRepository } from "../../domain/repositories/IArtPostRepository";
import { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { IFavoriteRepository } from "../../domain/repositories/IFavoriteRepository";
import { IAIGenerationRepository } from "../../domain/repositories/IAIGenerationRepository";
import { IAIConfigRepository } from "../../domain/repositories/IAIConfigRepository";
import { AIProviderService } from "../service/AIProviderService";
import { IWalletService } from "../../domain/interfaces/IWalletService";
import { WalletService } from "../service/WalletService";

import { LikeRepositoryImpl } from "../repositories/LikeRepositoryImpl";
import { ArtPostRepositoryImpl } from "../repositories/ArtPostRepositoryImpl";
import { CommentRepositoryImpl } from "../repositories/CommentRepositoryImpl";
import { CategoryRepositoryImpl } from "../repositories/CategoryRepositoryImpl";
import { FavoriteRepositoryImpl } from "../repositories/FavoriteRepositoryImpl";
import { AIGenerationRepositoryImpl } from "../repositories/AIGenerationRepositoryImpl";
import { AIConfigRepositoryImpl } from "../repositories/AIConfigRepositoryImpl";
import { IPlatformConfigRepository } from "../../domain/repositories/IPlatformConfigRepository";
import { PlatformConfigRepositoryImpl } from "../repositories/PlatformConfigRepositoryImpl";
import { IGetPlatformConfigUseCase } from "../../application/interface/usecase/admin/IGetPlatformConfigUseCase";
import { GetPlatformConfigUseCase } from "../../application/usecase/admin/GetPlatformConfigUseCase";
import { IUpdatePlatformConfigUseCase } from "../../application/interface/usecase/admin/IUpdatePlatformConfigUseCase";
import { UpdatePlatformConfigUseCase } from "../../application/usecase/admin/UpdatePlatformConfigUseCase";
import { IAdminPlatformConfigController } from "../../presentation/interface/IAdminPlatformConfigController";
import { AdminPlatformConfigController } from "../../presentation/controllers/AdminPlatformConfigController";

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
import { GetAllShopArtsUseCase } from "../../application/usecase/shop/GetAllShopArtsUseCase";
import { GetShopArtsByUserUseCase } from "../../application/usecase/shop/GetShopArtsByUserUseCase";
import { ArtToElasticSearchUseCase } from "../../application/usecase/art/ArtToElasticSearchUseCase";
import { GetAllArtWithUserIdUseCase } from "../../application/usecase/art/GetAllArtWithUserIdUseCase";
import { IBuyArtUseCase } from "../../application/interface/usecase/art/IBuyArtUseCase";
import { BuyArtUseCase } from "../../application/usecase/art/BuyArtUseCase";
import { IDownloadArtUseCase } from "../../application/interface/usecase/art/IDownloadArtUseCase";
import { DownloadArtUseCase } from "../../application/usecase/art/DownloadArtUseCase";
import { IS3Service } from "../../domain/interfaces/IS3Service";
import { S3Service } from "../../infrastructure/service/S3Service";

// Use Cases - Category
import { IEditCategoryUseCase } from "../../application/interface/usecase/category/IEditCategoryUseCase";
import { ICreateCategoryUseCase } from "../../application/interface/usecase/category/ICreateCategoryUseCase";
import { IGetAllCategoryUseCase } from "../../application/interface/usecase/category/IGetAllCategoryUseCase";

import { EditCategoryUseCase } from "../../application/usecase/category/EditCategoryUseCase";
import { CreateCategoryUseCase } from "../../application/usecase/category/CreateCategoryUseCase";
import { GetAllCategoryUseCase } from "../../application/usecase/category/GetAllCategoryUseCase";

// Use Cases - Comment
import { IGetCommentsUseCase } from "../../application/interface/usecase/comment/IGetCommentsUseCase";
import { IGetCommentByIdUseCase } from "../../application/interface/usecase/comment/IGetCommentByIdUseCase";
import { ICreateCommentUseCase } from "../../application/interface/usecase/comment/ICreateCommentUseCase";

import { GetCommentsUseCase } from "../../application/usecase/comment/GetCommentsUseCase";
import { GetCommentByIdUseCase } from "../../application/usecase/comment/GetCommentByIdUseCase";
import { CreateCommentUseCase } from "../../application/usecase/comment/CreateCommentUseCase";
import { IEditCommentUseCase } from "../../application/interface/usecase/comment/IEditCommentUseCase";
import { EditCommentUseCase } from "../../application/usecase/comment/EditCommentUseCase";
import { IDeleteCommentUseCase } from "../../application/interface/usecase/comment/IDeleteCommentUseCase";
import { DeleteCommentUseCase } from "../../application/usecase/comment/DeleteCommentUseCase";

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

// Use Cases - AI
import { IGenerateAIImageUseCase } from "../../application/interface/usecase/ai/IGenerateAIImageUseCase";
import { IGetMyAIGenerationsUseCase } from "../../application/interface/usecase/ai/IGetMyAIGenerationsUseCase";
import { ICheckAIQuotaUseCase } from "../../application/interface/usecase/ai/ICheckAIQuotaUseCase";
import { IUpdateAIConfigUseCase } from "../../application/interface/usecase/ai/admin/IUpdateAIConfigUseCase";
import { IGetAIConfigsUseCase } from "../../application/interface/usecase/ai/admin/IGetAIConfigsUseCase";
import { IGetAIAnalyticsUseCase } from "../../application/interface/usecase/ai/admin/IGetAIAnalyticsUseCase";
import { IDeleteAIGenerationUseCase } from "../../application/interface/usecase/ai/IDeleteAIGenerationUseCase"; // Added

import { GenerateAIImageUseCase } from "../../application/usecase/ai/GenerateAIImageUseCase";
import { GetMyAIGenerationsUseCase } from "../../application/usecase/ai/GetMyAIGenerationsUseCase";
import { CheckAIQuotaUseCase } from "../../application/usecase/ai/CheckAIQuotaUseCase";
import { UpdateAIConfigUseCase } from "../../application/usecase/ai/admin/UpdateAIConfigUseCase";
import { GetAIConfigsUseCase } from "../../application/usecase/ai/admin/GetAIConfigsUseCase";
import { GetAIAnalyticsUseCase } from "../../application/usecase/ai/admin/GetAIAnalyticsUseCase";
import { GetEnabledAIConfigsUseCase } from "../../application/usecase/ai/GetEnabledAIConfigsUseCase";
import { IGetEnabledAIConfigsUseCase } from "../../application/interface/usecase/ai/IGetEnabledAIConfigsUseCase";
import { DeleteAIGenerationUseCase } from "../../application/usecase/ai/DeleteAIGenerationUseCase"; // Added

// Controllers
import { IAIController } from "../../presentation/interface/IAIController";
import { IAdminAIController } from "../../presentation/interface/IAdminAIController";
import { AIController } from "../../presentation/controllers/AIController";
import { AdminAIController } from "../../presentation/controllers/AdminAIController";

import { ArtController } from "../../presentation/controllers/ArtController";
import { ShopController } from "../../presentation/controllers/ShopController";
import { LikeController } from "../../presentation/controllers/LikeController";
import { CommentController } from "../../presentation/controllers/CommentController";
import { FavoriteController } from "../../presentation/controllers/FavoriteController";
import { CategoryController } from "../../presentation/controllers/CategoryController";

import { IArtController } from "../../presentation/interface/IArtController";
import { IShopController } from "../../presentation/interface/IShopController";
import { ILikeController } from "../../presentation/interface/ILikeController";
import { ICommentController } from "../../presentation/interface/ICommentController";
import { IFavoriteController } from "../../presentation/interface/IFavoriteController";
import { ICategoryController } from "../../presentation/interface/ICategoryController";

import { IAdminArtRepository } from "../../domain/repositories/IAdminArtRepository";
import { AdminArtRepositoryImpl } from "../repositories/AdminArtRepositoryImpl";
import { IGetAllArtsUseCase } from "../../application/interface/usecase/admin/IGetAllArtsUseCase";
import { GetAllArtsUseCase } from "../../application/usecase/admin/GetAllArtsUseCase";
import { IGetArtStatsUseCase } from "../../application/interface/usecase/admin/IGetArtStatsUseCase";
import { GetArtStatsUseCase } from "../../application/usecase/admin/GetArtStatsUseCase";
import { IUpdateArtStatusUseCase } from "../../application/interface/usecase/admin/IUpdateArtStatusUseCase";
import { UpdateArtStatusUseCase } from "../../application/usecase/admin/UpdateArtStatusUseCase";
import { IAdminArtController } from "../../presentation/interface/IAdminArtController";
import { AdminArtController } from "../../presentation/controllers/AdminArtController";

// Bidding Imports
import { IAuctionRepository } from "../../domain/repositories/IAuctionRepository";
import { IBidRepository } from "../../domain/repositories/IBidRepository";
import { AuctionRepositoryImpl } from "../repositories/AuctionRepositoryImpl";
import { BidRepositoryImpl } from "../repositories/BidRepositoryImpl";
import { ICreateAuctionUseCase } from "../../application/interface/usecase/auction/ICreateAuctionUseCase";
import { CreateAuctionUseCase } from "../../application/usecase/auction/CreateAuctionUseCase";
import { IGetAuctionsUseCase } from "../../application/interface/usecase/auction/IGetAuctionsUseCase";
import { GetAuctionsUseCase } from "../../application/usecase/auction/GetAuctionsUseCase";
import { IGetAuctionStatsUseCase } from "../../application/interface/usecase/auction/IGetAuctionStatsUseCase";
import { GetAuctionStatsUseCase } from "../../application/usecase/auction/GetAuctionStatsUseCase";
import { IGetAuctionByIdUseCase } from "../../application/interface/usecase/auction/IGetAuctionByIdUseCase";
import { GetAuctionByIdUseCase } from "../../application/usecase/auction/GetAuctionByIdUseCase";
import { IPlaceBidUseCase } from "../../application/interface/usecase/bid/IPlaceBidUseCase";
import { PlaceBidUseCase } from "../../application/usecase/bid/PlaceBidUseCase";
import { IGetBidsUseCase } from "../../application/interface/usecase/bid/IGetBidsUseCase";
import { GetBidsUseCase } from "../../application/usecase/bid/GetBidsUseCase";
import { ICancelAuctionUseCase } from "../../application/interface/usecase/auction/ICancelAuctionUseCase";
import { CancelAuctionUseCase } from "../../application/usecase/auction/CancelAuctionUseCase";
import { IAuctionController } from "../../presentation/interface/IAuctionController";
import { AuctionController } from "../../presentation/controllers/AuctionController";
import { IBidController } from "../../presentation/interface/IBidController";
import { BidController } from "../../presentation/controllers/BidController";
import { IGetUserBidsUseCase } from "../../application/interface/usecase/bid/IGetUserBidsUseCase";
import { GetUserBidsUseCase } from "../../application/usecase/bid/GetUserBidsUseCase";


// AI Repositories
container.bind<IArtPostRepository>(TYPES.IArtPostRepository).to(ArtPostRepositoryImpl);
container.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepositoryImpl);
container.bind<ILikeRepository>(TYPES.ILikeRepository).to(LikeRepositoryImpl);
container.bind<ICommentRepository>(TYPES.ICommentRepository).to(CommentRepositoryImpl);
container.bind<IFavoriteRepository>(TYPES.IFavoriteRepository).to(FavoriteRepositoryImpl);
container.bind<IAIGenerationRepository>(TYPES.IAIGenerationRepository).to(AIGenerationRepositoryImpl);
container.bind<IAIConfigRepository>(TYPES.IAIConfigRepository).to(AIConfigRepositoryImpl);

// AI Use Cases
container.bind<IGenerateAIImageUseCase>(TYPES.IGenerateAIImageUseCase).to(GenerateAIImageUseCase);
container.bind<IGetMyAIGenerationsUseCase>(TYPES.IGetMyAIGenerationsUseCase).to(GetMyAIGenerationsUseCase);
container.bind<ICheckAIQuotaUseCase>(TYPES.ICheckAIQuotaUseCase).to(CheckAIQuotaUseCase);
container.bind<IGetEnabledAIConfigsUseCase>(TYPES.IGetEnabledAIConfigsUseCase).to(GetEnabledAIConfigsUseCase);
container.bind<IUpdateAIConfigUseCase>(TYPES.IUpdateAIConfigUseCase).to(UpdateAIConfigUseCase);
container.bind<IGetAIConfigsUseCase>(TYPES.IGetAIConfigsUseCase).to(GetAIConfigsUseCase);
container.bind<IGetAIAnalyticsUseCase>(TYPES.IGetAIAnalyticsUseCase).to(GetAIAnalyticsUseCase);
container.bind<IDeleteAIGenerationUseCase>(TYPES.IDeleteAIGenerationUseCase).to(DeleteAIGenerationUseCase);
container.bind<AIProviderService>(TYPES.AIProviderService).to(AIProviderService);
container.bind<IWalletService>(TYPES.IWalletService).to(WalletService);

// AI Controllers
container.bind<IAIController>(TYPES.IAIController).to(AIController);
container.bind<IAdminAIController>(TYPES.IAdminAIController).to(AdminAIController);

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
container.bind<IBuyArtUseCase>(TYPES.IBuyArtUseCase).to(BuyArtUseCase);
container.bind<IDownloadArtUseCase>(TYPES.IDownloadArtUseCase).to(DownloadArtUseCase);

// Services
import { ISocketService } from "../../domain/interfaces/ISocketService";
import { SocketService } from "../service/SocketService";

container.bind<IS3Service>(TYPES.IS3Service).to(S3Service);
container.bind<ISocketService>(TYPES.ISocketService).to(SocketService).inSingletonScope();

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
  .bind<IGetCommentByIdUseCase>(TYPES.IGetCommentByIdUseCase)
  .to(GetCommentByIdUseCase);
container
  .bind<ICreateCommentUseCase>(TYPES.ICreateCommentUseCase)
  .to(CreateCommentUseCase);
container
  .bind<IEditCommentUseCase>(TYPES.IEditCommentUseCase)
  .to(EditCommentUseCase);
container
  .bind<IDeleteCommentUseCase>(TYPES.IDeleteCommentUseCase)
  .to(DeleteCommentUseCase);

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
container.bind<ICategoryController>(TYPES.ICategoryController).to(CategoryController);

// Admin Art
container.bind<IAdminArtRepository>(TYPES.IAdminArtRepository).to(AdminArtRepositoryImpl);
container.bind<IGetAllArtsUseCase>(TYPES.IGetAllArtsUseCase).to(GetAllArtsUseCase);
container.bind<IGetArtStatsUseCase>(TYPES.IGetArtStatsUseCase).to(GetArtStatsUseCase);
container.bind<IUpdateArtStatusUseCase>(TYPES.IUpdateArtStatusUseCase).to(UpdateArtStatusUseCase);
container.bind<IAdminArtController>(TYPES.IAdminArtController).to(AdminArtController);

// Bidding Bindings
container.bind<IAuctionRepository>(TYPES.IAuctionRepository).to(AuctionRepositoryImpl);
container.bind<IBidRepository>(TYPES.IBidRepository).to(BidRepositoryImpl);

container.bind<ICreateAuctionUseCase>(TYPES.ICreateAuctionUseCase).to(CreateAuctionUseCase);
container.bind<IGetAuctionsUseCase>(TYPES.IGetAuctionsUseCase).to(GetAuctionsUseCase);
container.bind<IGetAuctionStatsUseCase>(TYPES.IGetAuctionStatsUseCase).to(GetAuctionStatsUseCase);
container.bind<IGetAuctionByIdUseCase>(TYPES.IGetAuctionByIdUseCase).to(GetAuctionByIdUseCase);
container.bind<IPlaceBidUseCase>(TYPES.IPlaceBidUseCase).to(PlaceBidUseCase);
container.bind<IGetBidsUseCase>(TYPES.IGetBidsUseCase).to(GetBidsUseCase);
container.bind<IGetUserBidsUseCase>(TYPES.IGetUserBidsUseCase).to(GetUserBidsUseCase);
container.bind<ICancelAuctionUseCase>(TYPES.ICancelAuctionUseCase).to(CancelAuctionUseCase);

container.bind<IAuctionController>(TYPES.IAuctionController).to(AuctionController);
container.bind<IBidController>(TYPES.IBidController).to(BidController);

// Platform Config
container.bind<IPlatformConfigRepository>(TYPES.IPlatformConfigRepository).to(PlatformConfigRepositoryImpl);
container.bind<IGetPlatformConfigUseCase>(TYPES.IGetPlatformConfigUseCase).to(GetPlatformConfigUseCase);
container.bind<IUpdatePlatformConfigUseCase>(TYPES.IUpdatePlatformConfigUseCase).to(UpdatePlatformConfigUseCase);
container.bind<IAdminPlatformConfigController>(TYPES.IAdminPlatformConfigController).to(AdminPlatformConfigController);

// RabbitMQ & Auction Ending
import { RabbitMQService } from "../messaging/RabbitMQService";
import { IEndAuctionUseCase } from "../../application/interface/usecase/auction/IEndAuctionUseCase";
import { EndAuctionUseCase } from "../../application/usecase/auction/EndAuctionUseCase";
import { AuctionEndedConsumer } from "../messaging/consumers/AuctionEndedConsumer";

container.bind<RabbitMQService>(TYPES.RabbitMQService).to(RabbitMQService).inSingletonScope();
container.bind<IEndAuctionUseCase>(TYPES.IEndAuctionUseCase).to(EndAuctionUseCase);
container.bind<AuctionEndedConsumer>(TYPES.AuctionEndedConsumer).to(AuctionEndedConsumer).inSingletonScope();

export { container };
