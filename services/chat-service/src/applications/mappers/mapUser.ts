import { UserDto } from "../interface/dto/MessageResponseDto";

export function mapToUserDto(userData: any): UserDto {
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
