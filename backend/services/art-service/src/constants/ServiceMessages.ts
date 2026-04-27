export enum SERVICE_MESSAGES {
  USER_PROFILE_FETCHED = 'User profile fetched',
  USER_PROFILE_NOT_FOUND = 'User profile not found',
  ERROR_FETCHING_USER = 'Error fetching user',
  ERROR_FETCHING_USERS_BATCH = 'Error fetching users in batch',
  
  WALLET_SPLIT_PURCHASE_ERROR = 'Process Split Purchase Error',
  WALLET_LOCK_FUNDS_ERROR = 'Error locking funds',
  WALLET_UNLOCK_FUNDS_ERROR = 'Error unlocking funds',
  WALLET_PROCESS_PAYMENT_ERROR = 'Error processing payment',
  WALLET_DISTRIBUTE_ERROR = 'Error distributing funds',
  WALLET_REFUND_ERROR = 'Error refunding funds',
  
  S3_UPLOAD_ERROR = 'Error uploading file to S3',
  S3_DELETE_ERROR = 'Error deleting file from S3',
  S3_GET_URL_ERROR = 'Error getting S3 URL',
  
  CHAT_SEND_ERROR = 'Error sending chat message',
  CHAT_FETCH_ERROR = 'Error fetching chat history',
  
  AI_PROVIDER_NOT_FOUND = 'AI provider not found',
  AI_GENERATION_ERROR = 'Error generating AI image',
  AI_CONNECTION_FAILED = 'AI provider connection failed',
  AI_API_KEY_MISSING = 'API key is missing',
  AI_POLLINATIONS_DOWNLOAD_FAILED = 'Image download failed, using URL fallback',
  AI_POLLINATIONS_SUCCESS = 'Image generated successfully',
  AI_PROVIDER_UPDATE = 'Manually updating AI provider API key',
  AI_PUTER_NOT_IMPLEMENTED = 'Puter.js provider not yet implemented',
  AI_GEMINI_NOT_CONFIGURED = 'Gemini API key not configured',
}

export const SERVICE_ROUTES = {
  USER_PROFILE_ID: (userId: string) => `/api/v1/user/profile-id/${userId}`,
  USER_BATCH: '/api/v1/user/batch',
  USER_PROFILE_USERNAME: (username: string) => `/api/v1/user/profile/${username}`,
  
  WALLET_SPLIT_PURCHASE: '/api/v1/wallet/transaction/split-purchase',
  WALLET_LOCK: '/api/v1/wallet/transaction/lock',
  WALLET_UNLOCK: '/api/v1/wallet/transaction/unlock',
  WALLET_PROCESS_PAYMENT: '/api/v1/wallet/transaction/process-payment',
  WALLET_DISTRIBUTE: '/api/v1/wallet/transaction/distribute',
  WALLET_REFUND: '/api/v1/wallet/refund',
  WALLET_BALANCE: (userId: string) => `/api/v1/wallet/balance/${userId}`,
  WALLET_HISTORY: (userId: string) => `/api/v1/wallet/history/${userId}`,
  WALLET_SETTLE_AUCTION: '/api/v1/wallet/transaction/settle-auction',
  WALLET_TRANSFER_LOCKED_COMMISSION: '/api/v1/wallet/transaction/transfer-locked-commission',
  
  CHAT_SEND: '/api/v1/chat/send',
  CHAT_HISTORY: (conversationId: string) => `/api/v1/chat/history/${conversationId}`,
};