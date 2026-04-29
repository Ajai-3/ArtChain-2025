export interface AdminArtData {
  _id: string;
  id: string;
  userId: string;
  title: string;
  artName: string;
  description: string;
  imageKey: string;
  previewUrl?: string;
  aspectRatio?: string;
  postType: string;
  status: string;
  priceType?: 'artcoin' | 'fiat' | 'free';
  artcoins?: number;
  fiatPrice?: number;
  counts?: {
    likes?: number;
    comments?: number;
    favorites?: number;
    downloads?: number;
  };
  user?: {
    id: string;
    name?: string;
    username?: string;
    profileImage?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminArtListResponse {
  data: {
    arts: AdminArtData[];
    total: number;
  };
  page: number;
  limit: number;
  nextPage: number | null;
  hasNextPage: boolean;
}