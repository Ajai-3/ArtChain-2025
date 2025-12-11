import { ROUTES } from "../constants/routes";

export const authRoutesConfig = {
  user: [
    { path: ROUTES.AUTH.LOGOUT, methods: ["POST"] },

    { path: ROUTES.USER.SUPPORT, methods: ["POST"] },
    { path: ROUTES.USER.UN_SUPPORT, methods: ["DELETE"] },
    { path: ROUTES.USER.REMOVE_SUPPORTER, methods: ["DELETE"] },

    { path: ROUTES.USER.ARTIST_REQUEST, methods: ["POST"] },
    { path: ROUTES.USER.ARTIST_REQUEST_STATUS, methods: ["GET"] },

    { path: ROUTES.USER.CHANGE_PASSWORD, methods: ["POST"] },
    { path: ROUTES.USER.CHANGE_EMAIL, methods: ["POST"] },
    { path: ROUTES.USER.VERIFY_EMAIL_TOKEN, methods: ["POST"] },
    { path: ROUTES.USER.DEACTIVATE, methods: ["POST"] },

    { path: ROUTES.USER.PROFILE, methods: ["PATCH"] },
    { path: ROUTES.USER.SUPPORTERS, methods: ["GET"] },
    { path: ROUTES.USER.SUPPORTING, methods: ["GET"] },

    { path: ROUTES.NOTIFICATIONS.BASE, methods: ["GET"] },
    { path: ROUTES.NOTIFICATIONS.MARK_ALL_READ, methods: ["PATCH"] },

    { path: ROUTES.ART.BASE, methods: ["POST", "PATCH", "DELETE"] },
    { path: ROUTES.ART.COMMENT, methods: ["POST"] },
    { path: ROUTES.ART.COMMENTS_BY_ID, methods: ["PUT", "DELETE"] },

    { path: ROUTES.ART.LIKE, methods: ["POST"] },
    { path: ROUTES.ART.DISLIKE, methods: ["DELETE"] },

    { path: ROUTES.UPLOAD.BASE, methods: ["POST", "PATCH"] },
    { path: ROUTES.UPLOAD.ART, methods: ["POST", "PATCH"] },
    { path: ROUTES.UPLOAD.DELETE, methods: ["POST"] },

    { path: ROUTES.WALLET.BASE, methods: ["POST", "GET", "PATCH"] },
    { path: ROUTES.WALLET.DETAILS, methods: ["GET"] },
    {
      path: ROUTES.WALLET.CREATE_CHECKOUT_SESSION,
      methods: ["POST", "GET", "PATCH"],
    },
    { path: ROUTES.WALLET.GET_TRANSACTIONS, methods: ["GET"] },
    { path: ROUTES.WALLET.CREATE_TRANSACTIONS, methods: ["POST"] },

    { path: ROUTES.ART.LIKE, methods: ["POST"] },
    { path: ROUTES.ART.UNLIKE, methods: ["DELETE"] },
    { path: ROUTES.ART.LIKES_BY_POST_ID, methods: ["GET"] },

    { path: ROUTES.ART.FAVORITE, methods: ["POST"] },
    { path: ROUTES.ART.UNFAVORITE, methods: ["DELETE"] },
    { path: ROUTES.ART.FAVORITES_BY_POST_ID, methods: ["GET"] },

    { path: ROUTES.CHAT.PRIVATE, methods: ["POST"] },
    { path: ROUTES.CHAT.RECENT, methods: ["GET"] },
    { path: ROUTES.CHAT.MESSAGE, methods: ["GET"] },

    { path: ROUTES.AI.GENERATE, methods: ["POST"] },
    { path: ROUTES.AI.QUOTA, methods: ["GET"] },
    { path: ROUTES.AI.GENERATIONS, methods: ["GET"] },

    { path: ROUTES.USER.REPORT, methods: ["POST"] },

    { path: ROUTES.CHAT.GROUP, methods: ["POST"] },
    { path: ROUTES.CHAT.GROUP_BY_ID, methods: ["GET", "PATCH", "DELETE"] },
    { path: ROUTES.CHAT.MEMBERS, methods: ["GET"] },
    { path: ROUTES.CHAT.MEMBER, methods: ["DELETE"] },
    { path: ROUTES.CHAT.ADMIN, methods: ["POST"] },
    { path: ROUTES.CHAT.DELETE_MESSAGE, methods: ["DELETE"] },
    
    { path: ROUTES.ART.AUCTIONS, methods: ["GET", "POST"] },
    { path: ROUTES.ART.AUCTION_BY_ID, methods: ["GET"] },
    { path: ROUTES.ART.BIDS, methods: ["POST"] },
  ],
  
  user_optional: [
    { path: ROUTES.AI.CONFIG, methods: ["GET"] },
    { path: ROUTES.USER.PROFILE_BY_USERNAME, methods: ["GET"] },
    
    { path: ROUTES.ART.FAVORITES_BY_USER, methods: ["GET"] },
    
    { path: ROUTES.ART.BASE, methods: ["GET"] },
    { path: ROUTES.ART.BY_NAME, methods: ["GET"] },
    { path: ROUTES.ART.BY_USER, methods: ["GET"] },
    { path: ROUTES.ART.COMMENTS, methods: ["GET"] },
    { path: ROUTES.ART.COMMENT, methods: ["GET"] },
    { path: ROUTES.ART.COMMENTS_BY_POST_ID, methods: ["GET"] },
  ],

  admin: [
    { path: ROUTES.ADMIN.DASHBOARD, methods: ["GET"] },
    { path: ROUTES.ADMIN.USERS, methods: ["GET", "PATCH", "DELETE"] },
    { path: ROUTES.ART.CATEGORY, methods: ["POST", "PATCH", "DELETE"] },
    { path: ROUTES.AI.CONFIG, methods: ["POST", "PATCH", "DELETE"] },
    { path: ROUTES.AI.ANALYTICS, methods: ["GET"] },
    { path: ROUTES.AI.TEST_PROVIDER, methods: ["POST"] },
  ],
};
