export const ERROR_MESSAGES = {
  // Validation
  INVALID_INPUT: 'Invalid input data',
  VALIDATION_FAILED: 'Validation failed',

  // 400 Bad Request
  BAD_REQUEST: 'Invalid request',
  INVALID_DATE: 'Invalid date format',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_CREDENTIALS: 'Invalid username or password',

  // 401 Unauthorized
  TOKEN_EXPIRED: 'Session expired',
  INVALID_USER_ROLE: 'Invalid user role',
  UNAUTHORIZED: 'Authentication required',
  ADMIN_REQUIRED: 'Admin privileges required',
  INVALID_ACCESS_TOKEN: 'Invalid access token',
  INVALID_TOKEN: 'Invalid authentication token',
  NEW_PASSWORD_IS_SAME_AS_CURRENT: 'New password cannot be the same as the current password.',
  INCORRECT_CURRENT_PASSWORD: 'The current password you entered is incorrect. Please try again.',

  // 403 Forbidden
  FORBIDDEN: 'Permission denied',
  ADMIN_ONLY: 'Admin access required',

  // 404 Not Found
  USER_NOT_FOUND: 'User not found',
  RESOURCE_NOT_FOUND: 'Resource not found',

  // 409 Conflict
  CONFLICT: 'Data conflict occurred',
  DUPLICATE_EMAIL: 'Email already exists',
  DUPLICATE_USERNAME: 'Username already exists',
  DUPLICATE_PHONE_NUMBER: 'Phone number already exists',

  // 500 Server Error
  SERVER_ERROR: 'Internal server error',
  DB_ERROR: 'Database operation failed',
} as const;