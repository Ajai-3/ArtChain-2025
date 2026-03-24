import { mapCdnUrl } from "../../../utils/mapCdnUrl";

export const toGetAllArtForAdmin = (art: any, user: any, counts: any) => {
  return {
    id: art?.id as string,
    artname: art?.artName,
    title: art?.title,
    description: art?.description,
    postType: art.postType,
    createdAt: art?.createdAt,
    updatedAt: art?.updatedAt,
    status: art?.status, 
    priceType: art?.priceType, 
    artcoins: art?.artcoins,
    previewUrl: mapCdnUrl(art.previewUrl),
    user: {
        name: user?.name || 'Unknown',
        username: user?.username || 'unknown',
        profileImage: user?.profileImage ? mapCdnUrl(user.profileImage) : '',
      },
    counts: {
        likes: counts.likes || 0,
        comments: counts.comments || 0,
        favorites: counts.favorites || 0,
        downloads: art.downloads || 0, 
      },
  };
}