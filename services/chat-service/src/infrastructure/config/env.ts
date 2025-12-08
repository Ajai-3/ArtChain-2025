import dotenv from "dotenv";
import { getArtChainSecrets } from "art-chain-shared";
dotenv.config();

const secrets = await getArtChainSecrets("ArtChainCommonSecret");

export const env = {
  port: process.env.PORT || 4007,
  mongo_uri: process.env.MONGO_URI || "",
  redis_url: process.env.REDIS_URL || "",
  frontend_url: process.env.FRONTEND_URL || "",
  user_service_url: process.env.USER_SERVICE_URL || "",
  jwt: {
    accessSecret: secrets.jwtAccessSecret,
  },
  aws_cdn_domain: secrets.aws_cdn_domain,
};
