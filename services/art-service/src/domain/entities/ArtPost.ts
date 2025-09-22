export type PriceType = "artcoin" | "fiat";
export type PostType = "original" | "repost" | "purchased";
export type PostStatus = "active" | "archived" | "deleted";
export class ArtPost {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly artName: string,
    public readonly description: string,
    public readonly artType: string,
    public readonly hashtags: string[],
    public readonly previewUrl: string,
    public readonly watermarkedUrl: string,
    public readonly aspectRatio: string,
    public readonly commentingDisabled = false,
    public readonly downloadingDisabled = false,
    public readonly isPrivate = false,
    public readonly isSensitive = false,
    public readonly isForSale = false,
    public readonly priceType?: PriceType,
    public readonly artcoins?: number,
    public readonly fiatPrice?: number | null,
    public readonly postType: PostType = "original",
    public readonly originalPostId?: string,
    public readonly status: PostStatus = "active",
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
