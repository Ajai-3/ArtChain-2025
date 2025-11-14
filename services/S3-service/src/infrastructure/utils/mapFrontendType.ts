export type FrontendImageType = "profileImage" | "bannerImage" | "backgroundImage";
export type BackendImageCategory = "profile" | "banner" | "background";

/**
 * Maps the frontend image type (used in UI forms)
 * to backend category (used in S3 / folder structure).
 */
export function mapFrontendType(
  type?: string | null
): BackendImageCategory {
  const typeMapping: Record<FrontendImageType, BackendImageCategory> = {
    profileImage: "profile",
    bannerImage: "banner",
    backgroundImage: "background",
  };

  const frontendType = (type as FrontendImageType)
  return typeMapping[frontendType];
}
