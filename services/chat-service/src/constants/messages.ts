export const ERROR_MESSAGES = {
  // Message related errors
  MESSAGE_CONTENT_EMPTY: "Message content cannot be empty",
  MESSAGE_NOT_FOUND: "Message not found",
  MESSAGE_ID_USER_ID_REQUIRED: "MessageId and UserId are required",
  INVALID_DELETE_MODE: "Invalid delete mode",
  DELETION_WINDOW_EXPIRED: "Deletion window expired",
  ONLY_SENDER_CAN_DELETE: "Only sender can delete this message",
  ONLY_SENDER_ADMIN_OWNER_CAN_DELETE: "Only sender, admin, or group owner can delete for everyone",

  // Conversation related errors
  CONVERSATION_NOT_FOUND: "Conversation not found",
  NOT_ALLOWED_TO_SEND_MESSAGE: "Not allowed to send message to this conversation",
  RECEIVER_ID_REQUIRED: "receiverId is required for first message",

  // User related errors
  USER_ID_OTHER_USER_ID_REQUIRED: "User ID and Other User ID are required",
  CANNOT_CREATE_CONVERSATION_WITH_SELF: "Cannot create conversation with yourself",
  PARTNER_USER_NOT_FOUND: "Partner user not found",
  USER_ID_OTHER_USER_ID_CANNOT_BE_SAME: "userId and otherUserId cannot be the same",

  // Authorization errors
  NOT_AUTHORIZED: "Not authorized",
  AUTHENTICATION_ERROR_TOKEN_MISSING: "Authentication error: Token missing",
  AUTHENTICATION_ERROR: "Authentication error",

  // Validation errors
  LIMIT_MUST_BE_POSITIVE_INTEGER: "limit must be a positive integer",
  CONVERSATION_ID_REQUIRED: "conversationId is required",
  X_USER_ID_HEADER_REQUIRED: "x-user-id header is required",
  NOT_A_GROUP_CONVERSATION: "Not a group conversation",
  ONLY_ADMIN_OWNER_CAN_REMOVE: "Only admins and owners can remove members",
  CANNOT_REMOVE_OWNER: "Cannot remove the owner",
  ADMIN_CANNOT_REMOVE_ADMIN: "Admins cannot remove other admins",
  ONLY_OWNER_CAN_ADD_ADMIN: "Only owner can add admins",
  USER_NOT_MEMBER: "User is not a member of this group",
  ONLY_ADMIN_CAN_ADD_MEMBER: "Only admins and owners can add members",
  ONLY_OWNER_CAN_REMOVE_ADMIN: "Only owner can remove admins",
} as const;

export const SUCCESS_MESSAGES = {
  // Message related success messages
  MESSAGES_FETCHED_SUCCESSFULLY: "Messages fetched successfully",

  // Conversation related success messages
  CONVERSATION_CREATED_SUCCESSFULLY: "Conversation created successfully",
  RESEND_CONVERSATIONS_RETRIEVED_SUCCESSFULLY: "Resend conversations retrieved successfully",
} as const;

export const DEFAULT_MESSAGES = {
  WELCOME_MESSAGE: "Hello! Looking forward to chatting with you!",
  GROUP_MESSAGE: "Hey new group created"
} as const;

