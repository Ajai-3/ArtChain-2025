import axios from "axios";
import { env } from "../config/env"
import { injectable } from "inversify";
import { UserDto } from "../../applications/interface/dto/MessageResponseDto";
import { IUserService } from "../../applications/interface/http/IUserService";

@injectable()
export class UserService implements IUserService {
  private readonly baseUrl = env.user_service_url;

  async getUserById(userId: string): Promise<UserDto | null> {
    try {
      const res = await axios.get<UserDto>(`${this.baseUrl}/users/${userId}`);
      return res.data;
    } catch (err) {
      return null;
    }
  }

  async getUsersByIds(userIds: string[]): Promise<UserDto[]> {
    if (!userIds.length) return [];
    try {
      const res = await axios.post<UserDto[]>(`${this.baseUrl}/api/v1/users/batch`, {
        ids: userIds,
      });
      return res.data;
    } catch (err) {
      return [];
    }
  }
}
