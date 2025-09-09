export interface ArtPostResponseDTO {
  id: string;
  userId: string;
  title: string;
  description: string;
  artType: string;
  hashtags: string[];
  originalUrl: string;
  watermarkedUrl: string;
  aspectRatio: string;
  isForSale: boolean;
  priceType?: "artcoin" | "fiat";
  artcoins?: number;
  fiatPrice?: number;
  postType: "original" | "repost" | "purchased";
  createdAt: Date;
  updatedAt: Date;
}
