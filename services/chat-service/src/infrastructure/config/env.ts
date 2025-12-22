import dotenv from "dotenv";
// import { getArtChainSecrets } from "art-chain-shared";
dotenv.config();

// COMMENTED OUT: AWS Secrets Manager (AWS credentials not working)
// const secrets = await getArtChainSecrets("ArtChainCommonSecret");

// Using hardcoded values from .env file instead
const secrets = {
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your-access-secret-key-here",
  aws_cdn_domain: process.env.AWS_CDN_DOMAIN || "your-cdn-domain-here.cloudfront.net",
};

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
