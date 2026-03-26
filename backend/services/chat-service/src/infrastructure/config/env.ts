import 'dotenv-flow/config';
// import { getArtChainSecrets } from "art-chain-shared";

// COMMENTED OUT: AWS Secrets Manager (AWS credentials not working)
// const secrets = await getArtChainSecrets("ArtChainCommonSecret");

// Using hardcoded values from .env file instead
const secrets = {
  jwtAccessSecret:
    process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-here',
  aws_cdn_domain:
    process.env.AWS_CDN_DOMAIN || 'your-cdn-domain-here.cloudfront.net',
};

export const env = {
  port: process.env.PORT || 4007,
  mongo_uri: process.env.MONGO_URI || '',
  redis_url: process.env.REDIS_URL || '',
  frontend_url: process.env.FRONTEND_URL || '',
  api_gateway_url: process.env.API_GATEWAY_URL || '',
  jwt: {
    accessSecret: secrets.jwtAccessSecret,
  },
  loki: {
    host: process.env.LOKI_HOST!,
    user: process.env.LOKI_USER,
    token: process.env.LOKI_TOKEN,
  },
  aws_cdn_domain: secrets.aws_cdn_domain,
};
