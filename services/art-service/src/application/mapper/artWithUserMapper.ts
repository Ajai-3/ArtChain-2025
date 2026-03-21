import { mapCdnUrl } from '../../utils/mapCdnUrl';

export const toArtWithUserResponse = (
  art: any,
  userData?: any,
  purchaser?: any,
) => {
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
      imageUrl:
        art.isForSale || art.downloadingDisabled
          ? mapCdnUrl(art.watermarkedUrl)
          : mapCdnUrl(art.previewUrl),
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
    imageUrl: mapCdnUrl(art.previewUrl),
    artist: {
      id: user?.id,
      username: user?.username,
      profileImage: user?.profileImage,
    },
    isSold: art.isSold,
  };
};

export const toShopArtListResponse = (
  art: any,
  user: any,
  favoriteCount: number,
) => {
  return {
    id: art._id ?? art.id,
    title: art.title,
    artName: art.artName,
    previewUrl: mapCdnUrl(art.previewUrl),
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

export const toArtWithUserForFavoriteResponse = (art: any, user: any) => {
  return {
    art: {
      id: art?._id?.toString() || art?.id,
      title: art.title,
      artName: art.artName,
      description: art.description,
      imageUrl: mapCdnUrl(art.previewUrl), 
      isForSale: art.isForSale || false,
      createdAt: art.createdAt,
    },
    user: {
      id: user?.id || user?._id?.toString(),
      name: user?.name || 'Unknown Artist',
      username: user?.username || 'unknown',
      profileImage: user?.profileImage ? mapCdnUrl(user.profileImage) : '',
    }
  };
};

export const toArtWithUserForLikeResponse = (art: any, user: any) => {
  return {
    art: {
      id: art?._id?.toString() || art?.id,
      title: art.title,
      artName: art.artName,
      description: art.description,
      imageUrl: mapCdnUrl(art.previewUrl), 
      isForSale: art.isForSale || false,
      createdAt: art.createdAt,
    },
    user: {
      id: user?.id || user?._id?.toString(),
      name: user?.name || 'Unknown Artist',
      username: user?.username || 'unknown',
      profileImage: user?.profileImage ? mapCdnUrl(user.profileImage) : '',
    }
  };
};  

export const toSaleHistoryResponse = (purchase: any, art: any, buyer: any) => {
  return {
    transactionId: purchase.transactionId,
    purchaseDate: purchase.purchaseDate,
    amount: purchase.amount,
    art: art ? {
      id: art._id?.toString() || art.id,
      title: art.title,
      artName: art.artName,
      imageUrl: mapCdnUrl(art.previewUrl),
      category: art.category,
    } : null,
    buyer: buyer ? {
      id: buyer.id || buyer._id?.toString(),
      name: buyer.name,
      username: buyer.username,
      profileImage: buyer.profileImage ? mapCdnUrl(buyer.profileImage) : '',
    } : null,
  };
};

export const toPurchaseHistoryResponse = (purchase: any, art: any, seller: any) => {
  return {
    transactionId: purchase.transactionId,
    purchaseDate: purchase.purchaseDate,
    amount: purchase.amount,
    art: art ? {
      id: art._id?.toString() || art.id,
      title: art.title,
      artName: art.artName,
      imageUrl: mapCdnUrl(art.previewUrl),
      category: art.category,
      createdAt: art.createdAt,
    } : null,
    seller: seller ? {
      id: seller.id || seller._id?.toString(),
      name: seller.name,
      username: seller.username,
      profileImage: seller.profileImage ? mapCdnUrl(seller.profileImage) : '',
    } : null,
  };
};
