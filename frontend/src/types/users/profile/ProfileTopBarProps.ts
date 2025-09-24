import type { User } from "../user/user"

export interface ProfileTopBarProps {
  user: User;
  isOwnProfile: boolean;
  artWorkCount: number,
  supportingCount: number;
  supportersCount: number;
  isSupporting: boolean;
}
