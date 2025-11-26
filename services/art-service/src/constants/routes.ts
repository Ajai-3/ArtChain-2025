/**
 * API Route Constants
 * 
 * This file contains all route path constants used throughout the application.
 * All route definitions should use these constants instead of hardcoded strings.
 */

export const ROUTES = {
  // Base API route
  BASE: "/api/v1/art",

  // Category routes
  CATEGORY: {
    BASE: "/category",
    BY_ID: "/category/:id",
  },

  // Art routes
  ART: {
    BASE: "/",
    BY_ID: "/:id",
    BY_USER_ID: "/user/:userId",
    BY_ART_NAME: "/by-name/:artname",
    COUNT: "/count/:userId",
    RECOMMENDED: "/recommended",
  },

  // Comment routes
  COMMENT: {
    BASE: "/comment",
    COMMENTS_BY_POST_ID: "/comments/:postId",
    BY_ID: "/comment/:id",
  },

  // Like routes
  LIKE: {
    BASE: "/like",
    UNLIKE: "/unlike",
    LIKES_BY_POST_ID: "/likes/:postId",
    LIKES_COUNT_BY_POST_ID: "/likes-count/:postId",
  },

  // Favorite routes
  FAVORITE: {
    BASE: "/favorite",
    UNFAVORITE: "/unfavorite",
    FAVORITES_BY_POST_ID: "/favorites/:postId",
    FAVORITES_COUNT_BY_POST_ID: "/favorites-count/:postId",
    FAVORITES_BY_USER_ID: "/favorites/user/:userId",
  },

  // Shop routes
  SHOP: {
    BASE: "/shop",
    BY_USER_ID: "/shop/:userId",
  },

  // AI routes
  AI: {
    BASE: "/ai",
    QUOTA: "/ai/quota",
    CONFIG: "/ai/config",
    GENERATE: "/ai/generate",
    GENERATIONS: "/ai/generations",
  },

  // Admin AI routes
  ADMIN_AI: {
    BASE: "/admin/ai",
    CONFIG: "/admin/ai/config",
    TEST_PROVIDER: "/admin/ai/test-provider",
    ANALYTICS: "/admin/ai/analytics",
  },
} as const;

