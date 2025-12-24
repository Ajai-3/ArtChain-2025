import axios from "axios";
import { config } from "../config/env";
import { injectable } from "inversify";
import { IUserService } from "../../application/interface/service/IUserService";

@injectable()
export class UserService implements IUserService {
  async getUserById(userId: string, currentUserId?: string): Promise<any> {
    try {
     
      const response = await axios.get(
        `${config.api_gateway_url}/api/v1/user/profile-id/${userId}`,
        {
          headers: {
            "x-user-id": currentUserId, 
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getUsersByIds(userIds: string[], currentUserId?: string): Promise<any[]> {
    try {
      const response = await axios.post(
        `${config.api_gateway_url}/api/v1/user/batch`,
        { ids: userIds, currentUserId },
        
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching users in batch", error);
      return [];
    }
  }

  async getUserByUsername(username: string): Promise<any> {
     try {
      const response = await axios.get(
        `${config.api_gateway_url}/api/v1/user/profile/${username}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching users in batch", error);
      return [];
    }
  }
}
