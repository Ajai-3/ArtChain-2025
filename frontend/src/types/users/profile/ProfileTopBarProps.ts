import type { User } from "../user/user"

export interface ProfileTopBarProps {
  user: User;
  isOwnProfile: boolean;
  supportingCount: number;
  supportersCount: number;
  isSupporting: boolean;
}
