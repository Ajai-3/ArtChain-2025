export const AUTH_MESSAGES = {
  // Registration
  ALL_FIELDS_REQUIRED: 'All fields are required',
  TOKEN_REQUIRED: 'Verification token is required',
  REGISTRATION_SUCCESS: 'Registration completed successfully',
  VERIFICATION_EMAIL_SENT: 'Verification email sent successfully',
  INVALID_VERIFICATION_TOKEN: 'Invalid or expired verification token',

  // Login
  LOGIN_SUCCESS: 'Login successful',
  INVALID_CREDENTIALS: 'Invalid email or password',

  // Password Reset
  INVALID_RESET_TOKEN: 'Invalid or expired reset token',
  PASSWORD_RESET_SUCCESS: 'Password updated successfully',
  RESET_EMAIL_SENT: 'Password reset email sent successfully',

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
  PASSWORD_REQUIRED: 'Password is required',
  CREDENTIALS_REQUIRED: 'Email and password are required',

  // General
  USER_NOT_FOUND: 'Account not found',
  EMAIL_REQUIRED: 'Email is required',
} as const;