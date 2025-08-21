export const USER_MESSAGES = {
  // Profile
  PROFILE_FETCH_SUCCESS: "User profile fetched successfully.",
  PROFILE_UPDATE_SUCCESS: "User profile updated successfully.",
  PROFILE_UPDATE_FAILED: "Failed to update user profile.",
  PROFILE_IMAGE_UPDATED: "Profile image updated successfully.",
  BANNER_IMAGE_UPDATED: "Banner image updated successfully.",
  BACKGROUND_IMAGE_UPDATED: "Background image updated successfully.",
  BIO_UPDATED: "User bio updated successfully.",

  // Followers & Supporters
  USER_ID_REQUIRED: "User ID is missing.",
  SUPPORTER_ADDED: "User is now supporting this account.",
  SUPPORTER_REMOVED: "User stopped supporting this account.",
  SUPPORTERS_FETCH_SUCCESS: "List of supporters fetched successfully.",
  SUPPORTING_FETCH_SUCCESS: "List of users you are supporting fetched successfully.",
  SUPPORTER_ALREADY_EXISTS: "You are already supporting this user.",
  NO_SUPPORTERS_FOUND: "No supporters found.",
  NO_SUPPORTING_FOUND: "You are not supporting any users.",
  SUPPORT_SUCCESS: "Support action completed successfully.",
  UNSUPPORT_SUCCESS: "Unsupport action completed successfully.",

  // Account & Status
  ACCOUNT_DEACTIVATED: "Your account has been deactivated.",
  ACCOUNT_REACTIVATED: "Your account has been reactivated.",
  ACCOUNT_NOT_FOUND: "User account not found.",
  USER_BLOCKED: "This user is blocked.",
  USER_UNBLOCKED: "This user is unblocked.",

  // Users
  GET_ALL_USERS_SUCCESS: "All users fetched successfully.",
  GET_ALL_USERS_FAILED: "Failed to fetch users.",
  MISSING_USER_IDS: "User ID or Current User ID is missing.",
  INVALID_SUPPORT_REQUEST: "Invalid support action: userId or currentUserId is missing.",
  ALREADY_SUPPORTING: "User is already supporting this user.",
  NOT_SUPPORTING: "You are not currently supporting this user.",
  USER_NOT_FOUND: "User not found."
} as const;