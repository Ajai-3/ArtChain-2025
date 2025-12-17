import 'dotenv-flow/config';
import jwt from "jsonwebtoken";
// import { getArtChainSecrets } from "art-chain-shared";

// COMMENTED OUT: AWS Secrets Manager (AWS credentials not working)
// const secrets = await getArtChainSecrets("ArtChainCommonSecret");

// Using hardcoded values from .env file instead
const secrets = {
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "your-access-secret-key-here",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-here",
  emailVerificationSecret: process.env.JWT_EMAIL_VERIFICATION_SECRET || "your-email-verification-secret-key-here",
};


export const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  frontend_url: process.env.FRONTEND_URL,
  services: {
    main: process.env.MAIN_SERVICE_URL,
    wallet: process.env.WALLET_SERVICE_URL,
    art: process.env.ART_SERVICE_URL,
    notifications: process.env.NOTIFICATION_URL,
    s3: process.env.S3_SERVICE_URL,
    elastic: process.env.ELASTIC_SEARCH_SERVICE_URL,
    chat: process.env.CHAT_SERVICE_URL,
  },
  jwt: {
    accessSecret: secrets.jwtAccessSecret,
    refreshSecret: secrets.jwtRefreshSecret,
    emailVerificationSecret: secrets.emailVerificationSecret,
    accessExpire: (process.env.JWT_ACCESS_EXPIRES_IN ||
      "5m") as jwt.SignOptions["expiresIn"],
    refreshExpire: (process.env.JWT_REFRESH_EXPIRES_IN ||
      "30d") as jwt.SignOptions["expiresIn"],
    emailVerificationExpire: (process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN ||
      "5m") as jwt.SignOptions["expiresIn"],
  },
};

console.log(config)
