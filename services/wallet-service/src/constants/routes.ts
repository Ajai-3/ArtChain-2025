/**
 * API Route Constants
 * 
 * This file contains all route path constants used throughout the application.
 * All route definitions should use these constants instead of hardcoded strings.
 */

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
  },

  // Transaction routes
  TRANSACTION: {
    GET_TRANSACTIONS: "/get-transactions",
    CREATE_TRANSACTION: "/create-transaction",
    PURCHASE: "/transaction/purchase",
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
  },
} as const;

