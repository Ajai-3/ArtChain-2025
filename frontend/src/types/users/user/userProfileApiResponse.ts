import type { User } from "./user";

export interface UserProfileApiResponse {
  message: string;
  data: {
    user: User;
    supportingCount: number;
    supportersCount: number;
    isSupporting?: boolean;
  };
}