export const ROUTES = {
  // Base API paths
  BASE: {
    API_V1: "/api/v1",
    WALLET: "/api/v1/wallet",
  },

  // Wallet routes
  WALLET: {
    DETAILS: "/details",
    CREATE: "/create",
    UPDATE: "/update",
    LOCK: "/lock",
    UNLOCK: "/unlock",
    SETTLE_AUCTION: "/settle-auction",
  },

  // Transaction routes
  TRANSACTION: {
    GET_TRANSACTIONS: "/get-transactions",
    CREATE_TRANSACTION: "/create-transaction",
    PURCHASE: "/transaction/purchase",
    SPLIT_PURCHASE: "/transaction/split-purchase",
    PAYMENT: "/transaction/payment",
  },

  // Withdrawal routes
  WITHDRAWAL: {
    CREATE_REQUEST: "/withdrawal/create",
    GET_REQUESTS: "/withdrawal/requests",
    GET_REQUEST_BY_ID: "/withdrawal/requests/:id",
  },

  // Stripe routes
  STRIPE: {
    CREATE_CHECKOUT_SESSION: "/stripe/create-checkout-session",
    SESSION_BY_ID: "/stripe/session/:id",
    WEBHOOK: "/stripe/webhook",
  },

  // Full paths (for middleware and external references)
  FULL: {
    WALLET_DETAILS: "/api/v1/wallet/details",
    WALLET_CREATE: "/api/v1/wallet/create",
    WALLET_UPDATE: "/api/v1/wallet/update",
    GET_TRANSACTIONS: "/api/v1/wallet/get-transactions",
    CREATE_TRANSACTION: "/api/v1/wallet/create-transaction",
    STRIPE_CREATE_CHECKOUT_SESSION: "/api/v1/wallet/stripe/create-checkout-session",
    STRIPE_SESSION_BY_ID: "/api/v1/wallet/stripe/session/:id",
    STRIPE_WEBHOOK: "/api/v1/wallet/stripe/webhook",
  },

  // Admin routes
  ADMIN: {
    BASE: "/admin",
    WALLETS: "/admin/wallets",
    SEARCH_WALLETS: "/admin/wallets/search",
    UPDATE_STATUS: "/admin/wallets/:walletId/status",
    GET_USER_TRANSACTIONS: "/admin/wallets/:walletId/transactions",
    REVENUE_STATS: "/admin/revenue-stats",
    ADMIN_TRANSACTIONS: "/admin/:adminId/transactions",
    // Withdrawal management
    WITHDRAWAL_REQUESTS: "/admin/withdrawal/requests",
    UPDATE_WITHDRAWAL_STATUS: "/admin/withdrawal/requests/:withdrawalId/status",
  },
} as const;

