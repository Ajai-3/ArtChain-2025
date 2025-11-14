import type { User } from "../user/user";

export interface ProfileSelectBarProps {
    user: User;
    isOwnProfile: boolean;
}