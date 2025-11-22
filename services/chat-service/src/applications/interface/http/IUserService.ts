import { UserDto } from "../dto/MessageResponseDto";

export interface IUserService {
  getUserById(id: string): Promise<UserDto>;
  getUsersByIds(ids: string[]): Promise<UserDto[]>;
}