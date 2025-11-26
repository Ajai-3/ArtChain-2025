import axios from 'axios';
import { config } from '../config/env';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage: string | null;
}

export class UserServiceClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.api_gateway_url;
  }

  async getUsersByIds(userIds: string[], token?: string): Promise<UserProfile[]> {
    try {
      const headers: any = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        headers['x-user-id'] = 'admin-action'; // Mock user id for admin actions if needed
        // Or better, pass the cookie if available
        headers['Cookie'] = `token=${token}`; // Try passing as cookie if it's a cookie-based auth
      }

      // If token is a Bearer token, use Authorization header. If it comes from cookie, we might need to pass it differently.
      // Assuming standard Bearer token for now or just passing what we got.
      
      const config = token ? { headers: { Authorization: `Bearer ${token}`, Cookie: `token=${token}` } } : {};

      const response = await axios.post(
        `${this.baseUrl}/api/v1/user/batch`, 
        { ids: userIds },
        config
      );
      
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching users from user-admin-service:', error);
      return [];
    }
  }

  async getUserById(userId: string): Promise<UserProfile | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/user/profile-id/${userId}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching user from user-admin-service:', error);
      return null;
    }
  }
}
