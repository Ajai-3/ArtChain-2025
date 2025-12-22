import "dotenv-flow/config";
import jwt from "jsonwebtoken";
// import { getArtChainSecrets } from "art-chain-shared";

// COMMENTED OUT: AWS Secrets Manager (AWS credentials not working)
// const secrets = await getArtChainSecrets("ArtChainCommonSecret");

// Using hardcoded values from .env file instead
const secrets = {
  aws_cdn_domain: process.env.AWS_CDN_DOMAIN || "your-cdn-domain-here.cloudfront.net",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your-access-secret-key-here",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-here",
  emailVerificationSecret: process.env.JWT_EMAIL_VERIFICATION_SECRET || "your-email-verification-secret-key-here",
};

export const config = {
  port: process.env.PORT || "4001",
  frontend_URL: process.env.FRONTEND_URL,
  aws_cdn_domain: secrets.aws_cdn_domain,
  rabbitmq_URL: process.env.RABBITMQ_URL || "",
  art_service_URL: process.env.ART_SERVICE_URL || "",
  isProduction: process.env.NODE_ENV === "production",
  jwt: {
    accessSecret: secrets.jwtAccessSecret,
    refreshSecret: secrets.jwtRefreshSecret,
    emailVerificationSecret: secrets.emailVerificationSecret,
    accessExpire: (process.env.JWT_ACCESS_EXPIRES_IN ||
      "5m") as jwt.SignOptions["expiresIn"],
    refreshExpire: (process.env.JWT_REFRESH_EXPIRES_IN ||
      "30d") as jwt.SignOptions["expiresIn"],
    emailVerificationExpire: (process.env.EMAIL_EXPIRES_IN ||
      "5m") as jwt.SignOptions["expiresIn"],
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  },
  grpc: {
    host: process.env.ELASTIC_GRPC_HOST || "localhost",
    port: process.env.ELASTIC_GRPC_PORT || "50051",
  },
};

console.log(config);
