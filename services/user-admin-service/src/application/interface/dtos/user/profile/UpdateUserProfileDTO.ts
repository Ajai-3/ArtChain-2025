export interface UpdateUserProfileDto {
  userId: string;
  profileImage?: string;
  name?: string;
  username?: string;
  bio?: string;
  country?: string;
  bannerImage?: string;
  backgroundImage?: string;
}