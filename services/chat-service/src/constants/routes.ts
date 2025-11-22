export const ROUTES = {
  // Base API routes
  API_V1: "/api/v1",
  API_V1_CHAT: "/api/v1/chat",

  // Chat service routes
  CHAT: {
    // Conversation routes
    CONVERSATION_PRIVATE: "/conversation/private",
    CONVERSATION_RECENT: "/conversation/recent",
    
    // Message routes
    MESSAGE_SEND: "/message/send",
    MESSAGE_BY_CONVERSATION_ID: "/message/:conversationId",
    MESSAGE_BY_MESSAGE_ID: "/message/:messageId",
  },

  // External service routes (User Service)
  EXTERNAL: {
    USER: {
      PROFILE_BY_ID: "/api/v1/user/profile-id/:userId",
      BATCH: "/api/v1/user/batch",
    },
  },
} as const;

// Helper function to build external user service routes
export const buildUserServiceRoute = (route: string, params?: Record<string, string>): string => {
  let builtRoute = route;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      builtRoute = builtRoute.replace(`:${key}`, value);
    });
  }
  return builtRoute;
};

// Helper function to build full API paths for documentation
export const buildFullPath = (route: string): string => {
  return `${ROUTES.API_V1_CHAT}${route}`;
};

