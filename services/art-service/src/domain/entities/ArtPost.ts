export class ArtPost {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly artType: string,
    public readonly hashtags: string[],
    public readonly originalUrl: string,
    public readonly watermarkedUrl: string,
    public readonly aspectRatio: string,
    public readonly commentingDisabled = false,
    public readonly downloadingDisabled = false,
    public readonly isPrivate = false,
    public readonly isSensitive = false,
    public readonly supporterOnly = false,
    public readonly isForSale = false,
    public readonly priceType?: "artcoin" | "fiat",
    public readonly artcoins?: number,
    public readonly fiatPrice?: number | null,
    public readonly postType: "original" | "repost" | "purchased" = "original",
    public readonly originalPostId?: string,
    public readonly status: "active" | "archived" | "deleted" = "active",
    public readonly createdAt = new Date(),
    public readonly updatedAt = new Date()
  ) {}
}
