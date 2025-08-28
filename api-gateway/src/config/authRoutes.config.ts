export const authRoutesConfig = {
  user: [
    "/api/v1/auth/logout",
    "/api/v1/user/profile",
    "/api/v1/user/profile/:userId",
    "/api/v1/user/support",
    "/api/v1/user/un-support",
    "/api/v1/user/artist-request",
    "/api/v1/user/artist-request/status",
    "/api/v1/user/change-password",
  ],
  admin: [
    "/api/v1/admin/dashboard",
    "/api/v1/admin/users"
  ]
};
