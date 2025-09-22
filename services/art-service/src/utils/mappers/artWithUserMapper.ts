export const toArtWithUserResponse = (art: any, userData: any) => {
  return {
    user: {
      id: userData?.id,
      name: userData?.name,
      username: userData?.username,
      profileImage: userData?.profileImage,
      bannerImage: userData?.bannerImage,
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
      isForSale: art.isForSale,
      isSensitive: art.isSensitive,
      postType: art.postType,
      status: art.status,
      createdAt: art.createdAt,
      updatedAt: art.updatedAt,
      imageUrl:
        art.isForSale || art.downloadingDisabled
          ? art.watermarkedUrl
          : art.previewUrl,
    },
     ...(art.isForSale && {
      price: {
        type: art.priceType,   
        artcoins: art.artcoins,  
        fiat: art.fiatPrice,     
      },
    }),
  };
};