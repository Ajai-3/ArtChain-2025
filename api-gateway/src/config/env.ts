import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getArtChainSecrets } from "art-chain-shared";

dotenv.config();

const secrets = await getArtChainSecrets();


export const config = {
  port: process.env.PORT || 3000,
  frontend_url: process.env.FRONTEND_URL,
  services: {
    main: process.env.MAIN_SERVICE_URL,
    art: process.env.ART_SERVICE_URL,
    upload: process.env.UPLOAD_SERVICE_URL
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
