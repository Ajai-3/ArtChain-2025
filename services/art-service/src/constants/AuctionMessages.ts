export const AUCTION_MESSAGES = {
  AUCTION_CREATED: "Auction created successfully",
  AUCTIONS_FETCHED: "Auctions fetched successfully",
  AUCTION_FETCHED: "Auction fetched successfully",
  AUCTION_NOT_FOUND: "Auction not found",
  BID_PLACED: "Bid placed successfully",
  BIDS_FETCHED: "Bids fetched successfully",
  USER_BIDS_FETCHED: "User bids fetched successfully",
  AUCTION_NOT_ACTIVE: "Auction is not active",
  AUCTION_NOT_STARTED: "Auction has not started yet",
  BID_TOO_LOW: "Bid amount must be higher than current bid",
  BID_BELOW_START_PRICE: "Bid amount must be at least start price",
  FUNDS_LOCK_FAILED: "Failed to lock funds. Insufficient balance or wallet service error.",
} as const;
