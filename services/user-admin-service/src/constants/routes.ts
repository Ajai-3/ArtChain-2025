/**
 * Centralized route constants for the application.
 * All route paths should be defined here and imported where needed.
 */

export const ROUTES = {
  // Base API routes
  API: {
    V1: '/api/v1',
    AUTH: '/api/v1/auth',
    USER: '/api/v1/user',
    ADMIN: '/api/v1/admin',
  },

  // Auth routes
  AUTH: {
    START_REGISTER: '/start-register',
    REGISTER: '/register',
    LOGIN: '/login',
    GOOGLE_AUTH: '/google-auth',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    REFRESH_TOKEN: '/refresh-token',
    LOGOUT: '/logout',
  },

  // User routes
  USER: {
    PROFILE: '/profile',
    PROFILE_BY_USERNAME: '/profile/:username',
    PROFILE_BY_ID: '/profile-id/:userId',
    BATCH: '/batch',
    SUPPORT: '/support/:userId',
    UNSUPPORT: '/un-support/:userId',
    REMOVE_SUPPORTER: '/remove/:supporterId',
    SUPPORTING: '/:id/supporting',
    SUPPORTERS: '/:id/supporters',
    ARTIST_REQUEST: '/artist-request',
    ARTIST_REQUEST_STATUS: '/artist-request/status',
    CHANGE_EMAIL: '/change-email',
    CHANGE_PASSWORD: '/change-password',
    VERIFY_EMAIL_TOKEN: '/verify-email-token',
    DEACTIVATE: '/deactivate',
    REPORT: '/report',
  },

  // Admin routes
  ADMIN: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    USERS: '/users',
    USER_BAN_TOGGLE: '/users/:userId/ban-toggle',
    GET_ARTIST_REQUESTS: '/get-artist-requests',
    ARTIST_REQUEST_APPROVE: '/artist-request/:id/approve',
    ARTIST_REQUEST_REJECT: '/artist-request/:id/reject',
    REPORTS: '/reports',
    REVENUE_STATS: '/revenue-stats',
  },

  // External service routes
  EXTERNAL: {
    ART_COUNT: '/api/v1/art/count/:userId',
    ELASTIC_SEARCH: '/api/v1/elastic/admin/search',
  },
} as const;

