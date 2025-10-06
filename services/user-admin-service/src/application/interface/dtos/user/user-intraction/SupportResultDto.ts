export interface SupportResultDto {
  supporter: {
    id: string;
    username: string;
    profileImage: string | null;
  };

  targetUser: {
    id: string;
    username: string;
  };

  createdAt: Date;
}
