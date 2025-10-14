import axios from "axios";
import { injectable } from "inversify";
import { config } from "../config/env";
import { BadRequestError } from "art-chain-shared";
import { IArtService } from "../../application/interface/http/IArtService";

@injectable()
export class ArtService implements IArtService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.art_service_URL;
  }

  async getUserArtCount(userId: string): Promise<number> {
    try {
      const res = await axios.get(`${this.baseUrl}/api/v1/art/count/${userId}`);
      return res.data.artworksCount;
    } catch (err) {
      console.warn(
        `Warning: Could not fetch artwork count for user ${userId}. Returning 0.`
      );
      return 0;
    }
  }
}
