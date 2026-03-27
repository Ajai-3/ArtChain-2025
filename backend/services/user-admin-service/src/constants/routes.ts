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
    INITIALIZE: '/initialize',
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
    DASHBOARD_STATS: '/dashboard-stats',
    REPORTS_GROUPED: '/reports/grouped',
    REPORTS_BULK_STATUS: '/reports/bulk-status',
  },

  // External service routes
  EXTERNAL: {
    // Art service routes
    ART_COUNT: '/api/v1/art/count/:userId',
    ART_TOP: '/api/v1/art/admin/art/stats/top',
    ART_CATEGORY: '/api/v1/art/admin/art/stats/categories',
    ELASTIC_SEARCH: '/api/v1/elastic/admin/search',
    ART_AUCTION_RECENT: '/api/v1/art/admin/auctions/recent',
    ART_COMMISSION_RECENT: '/api/v1/art/admin/commissions/recent',
    ART_STATUS: '/api/v1/art/admin/art/:artId/status',
    ART_COMMENT: '/api/v1/art/comment/:commentId',

    // Wallet service routes
    WALLET_ADMIN_TRANSACTIONS: '/api/v1/wallet/admin/transactions',
    WALLET_TRANSACTIONS_RECENT: '/api/v1/wallet/admin/transactions/recent',
    WALLET_TRANSACTIONS_STATS: '/api/v1/wallet/admin/transactions/stats',
    WALLET_REVENUE_STATS: '/api/v1/wallet/admin/revenue-stats',
  },
} as const;
