export const TYPES = {
  // Repositories
  ILikeRepository: Symbol.for("ILikeRepository"),
  IArtPostRepository: Symbol.for("IArtPostRepository"),
  ICommentRepository: Symbol.for("ICommentRepository"),
  ICategoryRepository: Symbol.for("ICategoryRepository"),
  IFavoriteRepository: Symbol.for("IFavoriteRepository"),

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

  // Use Cases - Category
  IEditCategoryUseCase: Symbol.for("IEditCategoryUseCase"),
  ICreateCategoryUseCase: Symbol.for("ICreateCategoryUseCase"),
  IGetAllCategoryUseCase: Symbol.for("IGetAllCategoryUseCase"),

  // Use Cases - Comment
  IGetCommentsUseCase: Symbol.for("IGetCommentsUseCase"),
  ICreateCommentUseCase: Symbol.for("ICreateCommentUseCase"),

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

  // Controllers
  IArtController: Symbol.for("IArtController"),
  IShopController: Symbol.for("IShopController"),
  ILikeController: Symbol.for("ILikeController"),
  ICommentController: Symbol.for("ICommentController"),
  IFavoriteController: Symbol.for("IFavoriteController"),
  ICategoryController: Symbol.for("ICategoryController"),
};
