export interface ApiError {
  status: number;
  statusCode: number;
  message: string;
  fullError?: any;
}
