export const toArtWithUserResponse = (art: any, userData?: any, purchaser?: any) => {
  return {
    user: {
      id: userData?.id,
      name: userData?.name,
      username: userData?.username,
      profileImage: userData?.profileImage,
      bannerImage: userData?.bannerImage,
      role: userData?.role,
      status: userData?.status,
      isVerified: userData?.isVerified,
      plan: userData?.plan,
      supportersCount: userData?.supportersCount ?? 0,
      supportingCount: userData?.supportingCount ?? 0,
      isSupporting: userData?.isSupporting ?? false,
    },
    art: {
      id: art._id ?? art.id,
      userId: art.userId,
      title: art.title,
      artName: art.artName,
      description: art.description,
      artType: art.artType,
      hashtags: art.hashtags,
      aspectRatio: art.aspectRatio,
      commentingDisabled: art.commentingDisabled,
      downloadingDisabled: art.downloadingDisabled,
      isPrivate: art.isPrivate,
      isForSale: art.isForSale && !art.isSold,
      isSold: art.isSold,
      isSensitive: art.isSensitive,
      postType: art.postType,
      status: art.status,
      createdAt: art.createdAt,
      updatedAt: art.updatedAt,
      imageUrl: art.isForSale || art.downloadingDisabled ? art.watermarkedUrl : art.previewUrl,
    },
    ...(art.isForSale && {
      price: {
        type: art.priceType,
        artcoins: art.artcoins,
        fiat: art.fiatPrice,
      },
    }),
    ...(purchaser && {
      purchaser: {
        id: purchaser.id,
        name: purchaser.name,
        username: purchaser.username,
        profileImage: purchaser.profileImage,
      },
    }),
  };
};

export const toShopItemResponse = (art: any, user: any) => {
  return {
    id: art._id ?? art.id,
    title: art.title,
    price: {
      artcoins: art.artcoins,
      fiat: art.fiatPrice,
      type: art.priceType,
    },
    imageUrl: art.previewUrl,
    artist: {
      id: user?.id,
      username: user?.username,
      profileImage: user?.profileImage,
    },
    isSold: art.isSold,
  };
};

export const toShopArtListResponse = (art: any, user: any, favoriteCount: number) => {
  return {
    id: art._id ?? art.id,
    title: art.title,
    artName: art.artName,
    previewUrl: art.previewUrl,
    artType: art.artType,
    priceType: art.priceType,
    artcoins: art.artcoins,
    fiatPrice: art.fiatPrice,
    status: art.status,
    favoriteCount,
    user: user
      ? {
          id: user.id,
          name: user.name,
          username: user.username,
          profileImage: user.profileImage,
        }
      : null,
  };
};