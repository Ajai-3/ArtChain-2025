export type FileCategory = "profile" | "banner" | "art" | "background";

export const FILE_CATEGORIES: Record<FileCategory, FileCategory> = {
  profile: "profile",
  banner: "banner",
  background: "background",
  art: "art",
} as const;
