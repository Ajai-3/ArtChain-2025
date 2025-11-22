export const ROUTES = {
  // Base routes
  API_BASE: "/api/v1",
  UPLOAD_BASE: "/api/v1/upload",

  // Upload routes (relative to UPLOAD_BASE)
  UPLOAD_ROOT: "/",
  UPLOAD_ART: "/art",
  UPLOAD_DELETE: "/delete",
  UPLOAD_PROFILE: "/profile",
  UPLOAD_BANNER: "/banner",

  // Full paths
  UPLOAD: "/api/v1/upload",
  UPLOAD_ART_FULL: "/api/v1/upload/art",
  UPLOAD_DELETE_FULL: "/api/v1/upload/delete",
} as const;

