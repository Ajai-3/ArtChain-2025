import { injectable } from "inversify";
import { IS3Service } from "../../domain/interfaces/IS3Service";
import { config } from "../config/env";
import { createSignedUrl } from "../../utils/createSignedUrl";

@injectable()
export class S3Service implements IS3Service {
  constructor() {}

  async getSignedUrl(key: string, type: string): Promise<string> {
    
      if (type === 'auction' || type === 'bidding' || type === 'art') {

          const url = `${config.cdn_domain}/${key}`;
          return createSignedUrl(url);
      }
      return createSignedUrl(`${config.cdn_domain}/${key}`);
  }
}
