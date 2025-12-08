import { injectable } from "inversify";
import axios from "axios";
import { IS3Service } from "../../domain/interfaces/IS3Service";
import { config } from "../config/env";

@injectable()
export class S3Service implements IS3Service {
  private readonly baseUrl: string;

  constructor() {
    // Assuming s3_service_url is added to config
    this.baseUrl = config.services.s3_service_url || "http://localhost:4004/api/v1/upload";
  }

  async getSignedUrl(key: string, type: string): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/signed-url`, {
        params: { key, type },
      });
      return response.data.signedUrl;
    } catch (error: any) {
      console.error(`Failed to get signed URL for key ${key}: ${error.message}`);
      throw new Error("Failed to generate download link");
    }
  }
}
