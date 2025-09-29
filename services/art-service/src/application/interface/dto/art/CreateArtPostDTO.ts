export interface CreateArtPostDTO {
  userId: string;
  title: string;
  description: string;
  artType: string;
  hashtags: string[];
  previewUrl: string;
  watermarkedUrl: string;
  aspectRatio: string;
  commentingDisabled?: boolean;
  downloadingDisabled?: boolean;
  isPrivate?: boolean;
  isSensitive?: boolean;
  supporterOnly?: boolean;
  isForSale?: boolean;
  priceType?: "artcoin" | "fiat";
  artcoins?: number;
  fiatPrice?: number | null;
}
