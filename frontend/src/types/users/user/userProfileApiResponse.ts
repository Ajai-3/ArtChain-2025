import type { User } from "./user";

export interface UserProfileApiResponse {
  message: string;
  data: {
    user: User;
    artWorkCount: number,
    supportingCount: number;
    supportersCount: number;
    isSupporting?: boolean;
  };
}