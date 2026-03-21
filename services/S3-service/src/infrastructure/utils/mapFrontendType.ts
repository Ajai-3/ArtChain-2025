export type FrontendImageType =
  | 'profileImage'
  | 'bannerImage'
  | 'backgroundImage'
  | 'chatImage'
  | 'biddingImage'
  | 'artImage';
export type BackendImageCategory =
  | 'profile'
  | 'banner'
  | 'background'
  | 'chat'
  | 'bidding'
  | 'art';

/**
 * Maps the frontend image type (used in UI forms)
 * to backend category (used in S3 / folder structure).
 */
export function mapFrontendType(type?: string | null): BackendImageCategory {
  const typeMapping: Record<FrontendImageType, BackendImageCategory> = {
    profileImage: 'profile',
    bannerImage: 'banner',
    backgroundImage: 'background',
    chatImage: 'chat',
    biddingImage: 'bidding',
    artImage: 'art',
  };

  const frontendType = type as FrontendImageType;
  return typeMapping[frontendType];
}
