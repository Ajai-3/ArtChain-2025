export type UserRole = 'user' | 'artist' | 'admin' | string;
export type UserStatus = 'active' | 'blocked' | 'deleted' | string;

export type UserPublicProfile = {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  bannerImage?: string;
  role?: UserRole;
  status?: UserStatus;
  isVerified?: boolean;
  plan?: string;
  supportersCount?: number;
  supportingCount?: number;
  isSupporting?: boolean;
};

