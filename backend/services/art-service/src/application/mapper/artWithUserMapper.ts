import { mapCdnUrl } from '../../utils/mapCdnUrl';
import type {
  ArtPostLike,
  ArtWithUserResponse,
  PurchaseLike,
} from '../../types/art-mapper';
import type { UserPublicProfile } from '../../types/user';

export const toArtWithUserResponse = (
  art: ArtPostLike,
  userData?: UserPublicProfile,
  purchaser?: UserPublicProfile,
): ArtWithUserResponse => {
  return {
    user: {
      id: userData?.id ?? '',
      name: userData?.name ?? '',
      username: userData?.username ?? '',
      profileImage: userData?.profileImage ?? '',
      bannerImage: userData?.bannerImage ?? '',
      role: userData?.role ?? '',
      status: userData?.status ?? '',
      isVerified: userData?.isVerified ?? false,
      plan: userData?.plan ?? '',
      supportersCount: userData?.supportersCount ?? 0,
      supportingCount: userData?.supportingCount ?? 0,
      isSupporting: userData?.isSupporting ?? false,
    },
    art: {
      id: (typeof art._id === 'string'
        ? art._id
        : art._id?.toString()) ?? art.id ?? '',
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
          ? mapCdnUrl(art.watermarkedUrl) ?? ''
          : mapCdnUrl(art.previewUrl) ?? '',
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
        role: purchaser.role,
        isVerified: purchaser.isVerified,
      },
    }),
  };
};

export const toShopItemResponse = (art: ArtPostLike, user: UserPublicProfile) => {
  return {
    id:
      (typeof art._id === 'string' ? art._id : art._id?.toString()) ??
      art.id ??
      '',
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
  art: ArtPostLike,
  user: UserPublicProfile | null,
  favoriteCount: number,
) => {
  return {
    id:
      (typeof art._id === 'string' ? art._id : art._id?.toString()) ??
      art.id ??
      '',
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

export const toArtWithUserForFavoriteResponse = (
  art: ArtPostLike,
  user: UserPublicProfile,
) => {
  return {
    art: {
      id:
        (typeof art._id === 'string' ? art._id : art._id?.toString()) ||
        art.id ||
        '',
      userId: art.userId,
      title: art.title,
      artName: art.artName,
      description: art.description,
      artType: art.artType,
      hashtags: art.hashtags || [],
      imageUrl: mapCdnUrl(art.previewUrl),
      aspectRatio: art.aspectRatio || '1:1',
      commentingDisabled: art.commentingDisabled || false,
      downloadingDisabled: art.downloadingDisabled || false,
      isPrivate: art.isPrivate || false,
      isSensitive: art.isSensitive || false,
      isForSale: art.isForSale || false,
      priceType: art.priceType,
      artcoins: art.artcoins,
      fiatPrice: art.fiatPrice,
      postType: art.postType || 'original',
      createdAt: art.createdAt,
      updatedAt: art.updatedAt,
    },
    user: {
      id: user?.id,
      name: user?.name || 'Unknown Artist',
      username: user?.username || 'unknown',
      profileImage: user?.profileImage ? mapCdnUrl(user.profileImage) : '',
    }
  };
};

export const toArtWithUserForLikeResponse = (
  art: ArtPostLike,
  user: UserPublicProfile,
) => {
  return {
    art: {
      id:
        (typeof art._id === 'string' ? art._id : art._id?.toString()) ||
        art.id ||
        '',
      userId: art.userId,
      title: art.title,
      artName: art.artName,
      description: art.description,
      artType: art.artType,
      hashtags: art.hashtags || [],
      imageUrl: mapCdnUrl(art.previewUrl),
      aspectRatio: art.aspectRatio || '1:1',
      commentingDisabled: art.commentingDisabled || false,
      downloadingDisabled: art.downloadingDisabled || false,
      isPrivate: art.isPrivate || false,
      isSensitive: art.isSensitive || false,
      isForSale: art.isForSale || false,
      priceType: art.priceType,
      artcoins: art.artcoins,
      fiatPrice: art.fiatPrice,
      postType: art.postType || 'original',
      createdAt: art.createdAt,
      updatedAt: art.updatedAt,
    },
    user: {
      id: user?.id,
      name: user?.name || 'Unknown Artist',
      username: user?.username || 'unknown',
      profileImage: user?.profileImage ? mapCdnUrl(user.profileImage) : '',
    }
  };
};  

export const toSaleHistoryResponse = (
  purchase: PurchaseLike,
  art: ArtPostLike | null,
  buyer: UserPublicProfile | null,
) => {
  return {
    transactionId: purchase.transactionId,
    purchaseDate: purchase.purchaseDate,
    amount: purchase.amount,
    art: art ? {
      id:
        (typeof art._id === 'string' ? art._id : art._id?.toString()) ||
        art.id ||
        '',
      title: art.title,
      artName: art.artName,
      imageUrl: mapCdnUrl(art.previewUrl),
      category: art.category,
    } : null,
    buyer: buyer ? {
      id: buyer.id,
      name: buyer.name,
      username: buyer.username,
      profileImage: buyer.profileImage ? mapCdnUrl(buyer.profileImage) : '',
    } : null,
  };
};

export const toPurchaseHistoryResponse = (
  purchase: PurchaseLike,
  art: ArtPostLike | null,
  seller: UserPublicProfile | null,
) => {
  return {
    transactionId: purchase.transactionId,
    purchaseDate: purchase.purchaseDate,
    amount: purchase.amount,
    art: art ? {
      id:
        (typeof art._id === 'string' ? art._id : art._id?.toString()) ||
        art.id ||
        '',
      title: art.title,
      artName: art.artName,
      imageUrl: mapCdnUrl(art.previewUrl),
      category: art.category,
      createdAt: art.createdAt,
    } : null,
    seller: seller ? {
      id: seller.id,
      name: seller.name,
      username: seller.username,
      profileImage: seller.profileImage ? mapCdnUrl(seller.profileImage) : '',
    } : null,
  };
};

export const toCreateArtPostResponse = (
  art: { userId: string; title: string; artName?: string; description: string; artType: string; hashtags?: string[]; previewUrl: string; watermarkedUrl: string; aspectRatio?: string; isForSale?: boolean; priceType?: string; artcoins?: number; fiatPrice?: number | null; postType?: string; isSensitive?: boolean; isPrivate?: boolean; commentingDisabled?: boolean; downloadingDisabled?: boolean; status?: string; createdAt?: Date; updatedAt?: Date },
  categoryId: string,
  count: number
) => {
  return {
    id: String(count),
    userId: art.userId,
    title: art.title,
    artName: art.artName ?? '',
    description: art.description,
    artType: art.artType,
    hashtags: art.hashtags ?? [],
    previewUrl: art.previewUrl,
    watermarkedUrl: art.watermarkedUrl,
    aspectRatio: art.aspectRatio ?? '1:1',
    isForSale: art.isForSale ?? false,
    priceType: art.priceType,
    artcoins: art.artcoins,
    fiatPrice: art.fiatPrice,
    postType: art.postType ?? 'original',
    category: categoryId,
    isSensitive: art.isSensitive ?? false,
    isPrivate: art.isPrivate ?? false,
    commentingDisabled: art.commentingDisabled ?? false,
    downloadingDisabled: art.downloadingDisabled ?? false,
    status: art.status ?? 'draft',
    createdAt: art.createdAt,
    updatedAt: art.updatedAt,
  };
};

export const toUpdateArtPostResponse = (
  updatedArt: { userId: string; title: string; artName?: string; description: string; artType: string; hashtags?: string[]; previewUrl: string; watermarkedUrl: string; aspectRatio?: string; isForSale?: boolean; priceType?: string; artcoins?: number; fiatPrice?: number | null; postType?: string; isSensitive?: boolean; isPrivate?: boolean; commentingDisabled?: boolean; downloadingDisabled?: boolean; status?: string; createdAt?: Date; updatedAt?: Date; categoryId?: string },
  id: string
) => {
  return {
    id: String(updatedArt.categoryId ?? id),
    userId: updatedArt.userId,
    title: updatedArt.title,
    artName: updatedArt.artName ?? '',
    description: updatedArt.description,
    artType: updatedArt.artType,
    hashtags: updatedArt.hashtags ?? [],
    previewUrl: updatedArt.previewUrl,
    watermarkedUrl: updatedArt.watermarkedUrl,
    aspectRatio: updatedArt.aspectRatio ?? '1:1',
    isForSale: updatedArt.isForSale ?? false,
    priceType: updatedArt.priceType,
    artcoins: updatedArt.artcoins,
    fiatPrice: updatedArt.fiatPrice,
    postType: updatedArt.postType ?? 'original',
    category: updatedArt.categoryId ?? '',
    isSensitive: updatedArt.isSensitive ?? false,
    isPrivate: updatedArt.isPrivate ?? false,
    commentingDisabled: updatedArt.commentingDisabled ?? false,
    downloadingDisabled: updatedArt.downloadingDisabled ?? false,
    status: updatedArt.status ?? 'draft',
    createdAt: updatedArt.createdAt,
    updatedAt: updatedArt.updatedAt,
  };
};
