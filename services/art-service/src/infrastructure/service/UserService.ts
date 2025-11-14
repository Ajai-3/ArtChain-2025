import axios from "axios";
import { config } from "../config/env";

export class UserService {
  static async getUserById(userId: string, currentUserId?: string): Promise<any> {
    try {
     
      const response = await axios.get(
        `${config.services.user_service_url}/profile-id/${userId}`,
        {
          headers: {
            "x-user-id": currentUserId, 
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async getUsersByIds(userIds: string[], currentUserId?: string): Promise<any[]> {
    try {
      const response = await axios.post(
        `${config.services.user_service_url}/batch`,
        { ids: userIds, currentUserId },
        
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching users in batch", error);
      return [];
    }
  }

  static async getUserByUsername(username: string): Promise<any> {
     try {
      const response = await axios.get(
        `${config.services.user_service_url}/profile/${username}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching users in batch", error);
      return [];
    }
  }
}
