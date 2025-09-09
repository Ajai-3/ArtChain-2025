export interface UpdateArtPostDTO {
  title?: string;
  description?: string;
  artType?: string;
  hashtags?: string[];
  commentingDisabled?: boolean;
  downloadingDisabled?: boolean;
  isPrivate?: boolean;
  isSensitive?: boolean;
  supporterOnly?: boolean;
  isForSale?: boolean;
  priceType?: "artcoin" | "fiat";
  artcoins?: number;
  fiatPrice?: number;
}
