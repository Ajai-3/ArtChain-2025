export const AUTH_MESSAGES = {
  // Registration
  VERIFICATION_EMAIL_SENT: 'Verification email sent successfully',
  REGISTRATION_SUCCESS: 'Registration completed successfully',
  INVALID_VERIFICATION_TOKEN: 'Invalid or expired verification token',
  TOKEN_REQUIRED: 'Verification token is required',
  ALL_FIELDS_REQUIRED: 'All fields are required',

  // Login
  LOGIN_SUCCESS: 'Login successful',
  INVALID_CREDENTIALS: 'Invalid email or password',

  // Password Reset
  RESET_EMAIL_SENT: 'Password reset email sent successfully',
  PASSWORD_RESET_SUCCESS: 'Password updated successfully',
  INVALID_RESET_TOKEN: 'Invalid or expired reset token',

  // Tokens
  TOKEN_REFRESH_SUCCESS: 'Access token refreshed',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  REFRESH_TOKEN_REQUIRED: 'Refresh token is required',

  // Change Password
  PASSWORD_UPDATED: 'Password updated successfully',

  // Logout
  LOGOUT_SUCCESS: 'Logged out successfully',

  // Validation
  VALIDATION_ERROR: 'Invalid input data',
  CREDENTIALS_REQUIRED: 'Email and password are required',
  PASSWORD_REQUIRED: 'Password is required',

  // General
  USER_NOT_FOUND: 'Account not found',
  EMAIL_REQUIRED: 'Email is required',
} as const;