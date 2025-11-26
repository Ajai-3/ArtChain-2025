/**
 * Application Route Constants
 * 
 * Centralized route definitions for the entire application.
 * Update routes here and they will reflect throughout the app.
 */

// Auth Routes
export const ROUTES = {
  // Authentication
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  VERIFY: '/verify',

  // Main Pages
  HOME: '/',
  CREATE: '/create',
  LIORA_AI: '/liora.ai',
  NOTIFICATIONS: '/notifications',
  BIDDING: '/bidding',
  SHOP: '/shop',
  WALLET: '/wallet',
  CHAT: '/chat',
  TEST: '/test',
  SUCCESS: '/success',
  CONTACT: '/contact',

  // Admin Routes
  ADMIN_LOGIN: '/admin-login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_WALLET_MANAGEMENT: '/admin/wallet-management',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_PASSWORD: '/settings/password',
  SETTINGS_PRIVACY: '/settings/privacy',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SUBSCRIPTIONS: '/settings/subscriptions',
  SETTINGS_PURCHASES: '/settings/purchases',
  SETTINGS_SALES: '/settings/sales',
  SETTINGS_LIKED: '/settings/liked',
  SETTINGS_BLOCKED: '/settings/blocked',
  SETTINGS_SUPPORT: '/settings/support',

  // Dynamic Routes (use these as templates)
  PROFILE: (username: string) => `/${username}`,
  PROFILE_GALLERY: (username: string) => `/${username}/gallery`,
  PROFILE_FAVORITES: (username: string) => `/${username}/favorites`,
  PROFILE_POSTS: (username: string) => `/${username}/posts`,
  PROFILE_SHOP: (username: string) => `/${username}/shop`,
  PROFILE_ABOUT: (username: string) => `/${username}/about`,
  ART_PAGE: (username: string, artname: string) => `/${username}/art/${artname}`,
  CHAT_CONVERSATION: (conversationId: string) => `/chat/${conversationId}`,
} as const;

// Route Patterns (for route definitions in React Router)
export const ROUTE_PATTERNS = {
  PROFILE: '/:username',
  PROFILE_GALLERY: '/:username/gallery',
  PROFILE_FAVORITES: '/:username/favorites',
  PROFILE_POSTS: '/:username/posts',
  PROFILE_SHOP: '/:username/shop',
  PROFILE_ABOUT: '/:username/about',
  ART_PAGE: '/:username/art/:artname',
  CHAT_CONVERSATION: '/chat/:conversationId',
} as const;

// Settings Tab IDs (for sidebar navigation)
export const SETTINGS_TABS = {
  PROFILE: 'profile',
  PASSWORD: 'password',
  PRIVACY: 'privacy',
  NOTIFICATIONS: 'notifications',
  SUBSCRIPTIONS: 'subscriptions',
  PURCHASES: 'purchases',
  SALES: 'sales',
  LIKED: 'liked',
  BLOCKED: 'blocked',
  SUPPORT: 'support',
} as const;

// Helper function to check if current path matches a route
export const isActiveRoute = (currentPath: string, routePath: string): boolean => {
  return currentPath === routePath || currentPath.startsWith(routePath + '/');
};
