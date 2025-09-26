import axios from "axios";
import { BadRequestError } from "art-chain-shared";
import { config } from "../config/env";

export class ArtService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.art_service_URL;
  }

  async getUserArtCount(userId: string): Promise<number> {
    try {
      const res = await axios.get(`${this.baseUrl}/api/v1/art/count/${userId}`);
      return res.data.artworksCount;
    } catch (err) {
      throw new BadRequestError(
        "Failed to fetch user's artwork count from Art service"
      );
    }
  }
}
