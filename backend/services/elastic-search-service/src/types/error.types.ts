export interface AppError extends Error {
  status?: number;
  stack?: string;
}

export interface ApiError {
  success: false;
  message: string;
  stack?: string;
}