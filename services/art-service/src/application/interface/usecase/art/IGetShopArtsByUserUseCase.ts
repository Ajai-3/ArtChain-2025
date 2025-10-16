export interface IGetAllShopArtsUseCase {
  execute(
    page?: number,
    limit?: number,
    filters?: {
      category?: string[];
      priceOrder?: "asc" | "desc";
      titleOrder?: "asc" | "desc";
      minPrice?: number;
      maxPrice?: number;
    }
  ): Promise<any[]>;
}
