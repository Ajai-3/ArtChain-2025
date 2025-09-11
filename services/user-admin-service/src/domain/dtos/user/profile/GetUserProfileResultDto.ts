interface GetUserProfileResultDto {
  user: any;
  isCurrentUser: boolean;
  isSupporting?: boolean;
  supportingCount: number;
  supportersCount: number;
}