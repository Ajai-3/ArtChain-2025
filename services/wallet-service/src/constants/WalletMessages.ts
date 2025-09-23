export enum WALLET_MESSAGES {
  FETCH_SUCCESS = "Wallet fetched successfully",
  CREATE_SUCCESS = "Wallet created successfully",
  UPDATE_SUCCESS = "Wallet updated successfully",
  USER_ID_MISSING = "User id is missing.",
  TRANSACTION_ALREADY_EXIST = "Transaction alredy exist.",
  STRIPE_SGNATURE_MISSING = "Missing Stripe signature",
  INVALID_WEBHOOK_SIGNATURE = "Invalid webhook signature",
  WALLET_NOT_FOUND = "Wallet not found",
  ERROR_FETCH = "Error fetching wallet",
  ERROR_CREATE = "Error creating wallet",
  ERROR_UPDATE = "Error updating wallet",
}
