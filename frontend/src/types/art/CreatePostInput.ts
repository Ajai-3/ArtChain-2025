export interface CreatePostInput {
  title: string;
  description: string;
  artType: string;
  hashtags: string[];
  originalUrl: string;
  previewUrl: string;
  watermarkedUrl: string;
  aspectRatio: string;
  commentingDisabled: boolean;
  downloadingDisabled: boolean;
  isPrivate: boolean;
  isSensitive: boolean;
  isForSale: boolean;
  priceType?: "artcoin" | "fiat";
  artcoins?: number;
  fiatPrice?: number;
}