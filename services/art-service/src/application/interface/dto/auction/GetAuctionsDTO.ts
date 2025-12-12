export interface GetAuctionsDTO {
  page: number;
  limit: number;
  filterStatus?: string;
  startDate?: Date;
  endDate?: Date;
  hostId?: string;
}
