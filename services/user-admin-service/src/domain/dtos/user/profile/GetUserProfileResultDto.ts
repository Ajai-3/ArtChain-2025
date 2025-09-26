interface GetUserProfileResultDto {
  user: any;
  isCurrentUser: boolean;
  isSupporting?: boolean;
  artWorkCount: number;
  supportingCount: number;
  supportersCount: number;
}