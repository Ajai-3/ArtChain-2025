import { UserDto } from '../interface/dto/MessageResponseDto';

export interface RawUserData {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  plan?: string;
  role?: string;
  status?: string;
}

export function mapToUserDto(userData: RawUserData): UserDto {
  return {
    id: userData.id,
    name: userData.name,
    username: userData.username,
    profileImage: userData.profileImage,
    plan: userData.plan,
    role: userData.role,
    status: userData.status,
  };
}
