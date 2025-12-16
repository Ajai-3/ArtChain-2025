export const TYPES = {
  // Repositories
  ILikeRepository: Symbol.for("ILikeRepository"),
  IArtPostRepository: Symbol.for("IArtPostRepository"),
  ICommentRepository: Symbol.for("ICommentRepository"),
  ICategoryRepository: Symbol.for("ICategoryRepository"),
  IFavoriteRepository: Symbol.for("IFavoriteRepository"),
  IAuctionRepository: Symbol.for("IAuctionRepository"),
  IBidRepository: Symbol.for("IBidRepository"),

  // AI Repositories
  IAIGenerationRepository: Symbol.for("IAIGenerationRepository"),
  IAIConfigRepository: Symbol.for("IAIConfigRepository"),
  IPlatformConfigRepository: Symbol.for("IPlatformConfigRepository"),
  AIProviderService: Symbol.for("AIProviderService"),

  // Use Cases - Art
  IGetAllArtUseCase: Symbol.for("IGetAllArtUseCase"),
  IGetArtByIdUseCase: Symbol.for("IGetArtByIdUseCase"),
  ICountArtWorkUseCase: Symbol.for("ICountArtWorkUseCase"),
  IGetArtByNameUseCase: Symbol.for("IGetArtByNameUseCase"),
  ICreateArtPostUseCase: Symbol.for("ICreateArtPostUseCase"),
  IGetAllShopArtsUseCase: Symbol.for("IGetAllShopArtsUseCase"),
  IGetShopArtsByUserUseCase: Symbol.for("IGetShopArtsByUserUseCase"),
  IArtToElasticSearchUseCase: Symbol.for("IArtToElasticSearchUseCase"),
  IGetAllArtWithUserIdUseCase: Symbol.for("IGetAllArtWithUserIdUseCase"),
  IBuyArtUseCase: Symbol.for("IBuyArtUseCase"),

  // Use Cases - Category
  IEditCategoryUseCase: Symbol.for("IEditCategoryUseCase"),
  ICreateCategoryUseCase: Symbol.for("ICreateCategoryUseCase"),
  IGetAllCategoryUseCase: Symbol.for("IGetAllCategoryUseCase"),

  // Use Cases - Comment
  IGetCommentsUseCase: Symbol.for("IGetCommentsUseCase"),
  IGetCommentByIdUseCase: Symbol.for("IGetCommentByIdUseCase"),
  ICreateCommentUseCase: Symbol.for("ICreateCommentUseCase"),
  IEditCommentUseCase: Symbol.for("IEditCommentUseCase"),
  IDeleteCommentUseCase: Symbol.for("IDeleteCommentUseCase"),

  // Use Cases - Favorite
  IAddFavoriteUseCase: Symbol.for("IAddFavoriteUseCase"),
  IRemoveFavoriteUseCase: Symbol.for("IRemoveFavoriteUseCase"),
  IGetFavoriteCountUseCase: Symbol.for("IGetFavoriteCountUseCase"),
  IGetFavoritedUsersUseCase: Symbol.for("IGetFavoritedUsersUseCase"),
  IGetUserFavoritedArtsUseCase: Symbol.for("IGetUserFavoritedArtsUseCase"),

  // Use Cases - Like
  ILikePostUseCase: Symbol.for("ILikePostUseCase"),
  IUnlikePostUseCase: Symbol.for("IUnlikePostUseCase"),
  IGetLikeCountUseCase: Symbol.for("IGetLikeCountUseCase"),
  IGetLikedUsersUseCase: Symbol.for("IGetLikedUsersUseCase"),

  // Use Cases - AI
  IGenerateAIImageUseCase: Symbol.for("IGenerateAIImageUseCase"),
  IGetMyAIGenerationsUseCase: Symbol.for("IGetMyAIGenerationsUseCase"),
  ICheckAIQuotaUseCase: Symbol.for("ICheckAIQuotaUseCase"),
  IGetEnabledAIConfigsUseCase: Symbol.for("IGetEnabledAIConfigsUseCase"),
  IUpdateAIConfigUseCase: Symbol.for("IUpdateAIConfigUseCase"),
  IGetAIConfigsUseCase: Symbol.for("IGetAIConfigsUseCase"),
  IGetAIAnalyticsUseCase: Symbol.for("IGetAIAnalyticsUseCase"),
  IDeleteAIGenerationUseCase: Symbol.for("IDeleteAIGenerationUseCase"),


  
  // Use Cases - Bidding
  ICreateAuctionUseCase: Symbol.for("ICreateAuctionUseCase"),
  IGetAuctionsUseCase: Symbol.for("IGetAuctionsUseCase"),
  IGetAuctionStatsUseCase: Symbol.for("IGetAuctionStatsUseCase"),
  IGetAuctionByIdUseCase: Symbol.for("IGetAuctionByIdUseCase"),
  IPlaceBidUseCase: Symbol.for("IPlaceBidUseCase"),
  IGetBidsUseCase: Symbol.for("IGetBidsUseCase"),
  IGetUserBidsUseCase: Symbol.for("IGetUserBidsUseCase"),
  ICancelAuctionUseCase: Symbol.for("ICancelAuctionUseCase"),
  IArtController: Symbol.for("IArtController"),
  IShopController: Symbol.for("IShopController"),
  ILikeController: Symbol.for("ILikeController"),
  ICommentController: Symbol.for("ICommentController"),
  IFavoriteController: Symbol.for("IFavoriteController"),
  ICategoryController: Symbol.for("ICategoryController"),
  IAIController: Symbol.for("IAIController"),
  IAdminAIController: Symbol.for("IAdminAIController"),
  IAuctionController: Symbol.for("IAuctionController"),
  IBidController: Symbol.for("IBidController"),

  // Admin Art
  IAdminArtRepository: Symbol.for("IAdminArtRepository"),
  IGetAllArtsUseCase: Symbol.for("IGetAllArtsUseCase"),
  IGetArtStatsUseCase: Symbol.for("IGetArtStatsUseCase"),
  IUpdateArtStatusUseCase: Symbol.for("IUpdateArtStatusUseCase"),
  IAdminArtController: Symbol.for("IAdminArtController"),
  UserServiceClient: Symbol.for("UserServiceClient"),
  IWalletService: Symbol.for("IWalletService"),
  IS3Service: Symbol.for("IS3Service"),
  IDownloadArtUseCase: Symbol.for("IDownloadArtUseCase"),
  ISocketService: Symbol.for("ISocketService"),

  // Platform Config
  IGetPlatformConfigUseCase: Symbol.for("IGetPlatformConfigUseCase"),
  IUpdatePlatformConfigUseCase: Symbol.for("IUpdatePlatformConfigUseCase"),
  IAdminPlatformConfigController: Symbol.for("IAdminPlatformConfigController"),
  RabbitMQService: Symbol.for("RabbitMQService"),
  IEndAuctionUseCase: Symbol.for("IEndAuctionUseCase"),
  AuctionEndedConsumer: Symbol.for("AuctionEndedConsumer"),
};
