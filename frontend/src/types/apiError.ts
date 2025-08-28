export interface ApiError {
  status: number;
  statusCode?: number;
  message: string;
  isNetworkError?: boolean;
  fullError?: any;
}
