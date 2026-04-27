export type ShopArtListItem = {
  id: string;
  title: string;
  artName: string;
  previewUrl: string;
  artType: string;
  priceType: string;
  artcoins: number;
  fiatPrice: number;
  status: string;
  favoriteCount: number;
  user: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
  } | null;
};

export interface IGetAllShopArtsUseCase {
  execute(
    page?: number,
    limit?: number,
    filters?: {
      category?: string[];
      priceOrder?: 'asc' | 'desc';
      titleOrder?: 'asc' | 'desc';
      minPrice?: number;
      maxPrice?: number;
    }
  ): Promise<ShopArtListItem[]>;
}
