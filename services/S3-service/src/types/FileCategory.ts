export type FileCategory = "profile" | "banner" | "art" | "background" | "chat" | "bidding";

export const FILE_CATEGORIES: Record<FileCategory, FileCategory> = {
  profile: "profile",
  banner: "banner",
  background: "background",
  art: "art",
  chat: "chat",
  bidding: "bidding",
} as const;
