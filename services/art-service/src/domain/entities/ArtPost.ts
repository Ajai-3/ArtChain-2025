export class ArtPost {
  constructor(
    public userId: string,
    public title: string,
    public description: string,
    public artType: string,
    public hashtags: string[],
    public originalUrl: string,
    public watermarkedUrl: string,
    public aspectRatio: string,
    public commentingDisabled = false,
    public downloadingDisabled = false,
    public isPrivate = false,
    public isSensitive = false,
    public supporterOnly = false,
    public isForSale = false,
    public priceType?: "artcoin" | "fiat",
    public artcoins?: number,
    public fiatPrice?: number,
    public postType: "original" | "repost" | "purchased" = "original",
    public originalPostId?: string,
    public status: "active" | "archived" | "deleted" = "active",
    public createdAt = new Date(),
    public updatedAt = new Date()
  ) {}
}
