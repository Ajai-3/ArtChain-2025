export const AUTH_MESSAGES = {
  // Registration
  ALL_FIELDS_REQUIRED: 'All fields are required.',
  TOKEN_REQUIRED: 'Verification token is required.',
  REGISTRATION_SUCCESS: 'Registration completed successfully.',
  VERIFICATION_EMAIL_SENT: 'Verification email sent successfully.',
  INVALID_VERIFICATION_TOKEN: 'Invalid or expired verification token.',
  DUPLICATE_EMAIL: 'Email already exists.',
  DUPLICATE_USERNAME: 'Username already exists.',
  DUPLICATE_PHONE_NUMBER: 'Phone number already exists.',

  // Login
  LOGIN_SUCCESS: 'Login successful.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  INVALID_EMAIL: 'Invalid email format.',
  LOGIN_NOT_ALLOWED: 'Your account is not allowed to login.',
  ACCOUNT_BANNED: 'Your account has been banned.',
  ACCOUNT_DELETED: 'Your account has been deleted.',
  YOUR_ACCOUNT_BANNED: 'Your account has been banned by admin.',

  // Password Reset
  INVALID_RESET_TOKEN: 'Invalid or expired reset token.',
  PASSWORD_RESET_SUCCESS: 'Password updated successfully.',
  RESET_EMAIL_SENT: 'Password reset email sent successfully.',
  INVALID_FORGOT_PASSWORD_IDENTIFIER: 'Invalid request. Please provide a valid email or username.',

  // Tokens
  TOKEN_REFRESH_SUCCESS: 'Access token refreshed successfully.',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token.',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required.',
  TOKEN_EXPIRED: 'Session expired.',
  INVALID_ACCESS_TOKEN: 'Invalid access token.',
  INVALID_TOKEN: 'Invalid authentication token.',

  // Change Password
  PASSWORD_UPDATED: 'Password updated successfully.',
  NEW_PASSWORD_IS_SAME_AS_CURRENT: 'New password cannot be the same as the current password.',
  INCORRECT_CURRENT_PASSWORD: 'The current password you entered is incorrect.',

  // Logout
  LOGOUT_SUCCESS: 'Logged out successfully.',

  // Validation
  VALIDATION_ERROR: 'Invalid input data.',
  PASSWORD_REQUIRED: 'Password is required.',
  CREDENTIALS_REQUIRED: 'Email and password are required.',

  // Authorization
  UNAUTHORIZED: 'Authentication required.',
  ADMIN_REQUIRED: 'Admin privileges required.',
  INVALID_USER_ROLE: 'Invalid user role.',
  ADMIN_ONLY: 'Admin access required.',
  USER_NOT_FOUND: 'User not found.',


  INVALID_CHANGE_EMAIL_TOKEN: 'Invalid change email token',
  EMAIL_UPDATE_FAILED: 'Email updation failed'
} as const;