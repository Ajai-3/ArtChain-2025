export const authRoutesConfig = {
  user: [
    { path: "/api/v1/auth/logout", methods: ["POST"] },

    { path: "/api/v1/user/support/:userId", methods: ["POST"] },
    { path: "/api/v1/user/un-support/:userId", methods: ["DELETE"] },
    { path: "/api/v1/user/remove/:supporterId", methods: ["DELETE"] },

    { path: "/api/v1/user/artist-request", methods: ["POST"] },
    { path: "/api/v1/user/artist-request/status", methods: ["GET"] },

    { path: "/api/v1/user/change-password", methods: ["POST"] },
    { path: "/api/v1/user/change-email", methods: ["POST"] },
    { path: "/api/v1/user/verify-email-token", methods: ["POST"] },
    { path: "/api/v1/user/deactivate", methods: ["POST"] },

    { path: "/api/v1/user/profile", methods: ["PATCH"] },
    { path: "/api/v1/user/:id/supporters", methods: ["GET"] },
    { path: "/api/v1/user/:id/supporting", methods: ["GET"] },

    { path: "/api/v1/user/batch", methods: ["POST"] },

    { path: "/api/v1/notifications", methods: ["GET"] },
    { path: "/api/v1/notifications/mark-all-read", methods: ["PATCH"] },

    { path: "/api/v1/art", methods: ["POST", "PATCH", "DELETE"] },
    { path: "/api/v1/art/comment", methods: ["POST", "PATCH", "DELETE"] },

    { path: "/api/v1/art/like", methods: ["POST"] },
    { path: "/api/v1/art/disLike", methods: ["DELETE"] },

    { path: "/api/v1/upload", methods: ["POST", "PATCH"] },
    { path: "/api/v1/upload/art", methods: ["POST", "PATCH"] },
    { path: "/api/v1/upload/delete", methods: ["POST"] },

    { path: "/api/v1/wallet", methods: ["POST", "GET", "PATCH"] },
    { path: "/api/v1/wallet/details", methods: ["GET"] },
    {
      path: "/api/v1/wallet/stripe/create-checkout-session",
      methods: ["POST", "GET", "PATCH"],
    },
    { path: "/api/v1/wallet/get-transactions", methods: ["GET"] },
    { path: "/api/v1/wallet/create-transactions", methods: ["POST"] },

    { path: "/api/v1/art/like", methods: ["POST"] },
    { path: "/api/v1/art/unlike", methods: ["DELETE"] },
    { path: "/api/v1/art/likes/:postId", methods: ["GET"] },

    { path: "/api/v1/art/favorite", methods: ["POST"] },
    { path: "/api/v1/art/unfavorite", methods: ["DELETE"] },
    { path: "/api/v1/art/favorites/:postId", methods: ["GET"] },
  ],

  user_optional: [
    { path: "/api/v1/user/profile/:username", methods: ["GET"] },

    { path: "/api/v1/art", methods: ["GET"] },
    { path: "/api/v1/art/by-name/:artname", methods: ["GET"] },
    { path: "/api/v1/art/use", methods: ["GET"] },
    { path: "/api/v1/art/comments", methods: ["GET"] },
    { path: "/api/v1/art/comment", methods: ["GET"] },
    { path: "/api/v1/art/comment", methods: ["GET"] },
    { path: "/api/v1/art/comments/:postId", methods: ["GET"] },
  ],

  admin: [
    { path: "/api/v1/admin/dashboard", methods: ["GET"] },
    { path: "/api/v1/admin/users", methods: ["GET", "PATCH", "DELETE"] },
    { path: "/api/v1/art/category", methods: ["POST", "PATCH", "DELETE"] },
  ],
};
