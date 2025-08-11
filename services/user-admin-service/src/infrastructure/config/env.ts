import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { getArtChainSecrets } from 'art-chain-shared';

dotenv.config();

const secrets = await getArtChainSecrets();


export const config = {
  port: process.env.PORT || '3001',
  isProduction: process.env.NODE_ENV === 'production',
  jwt: {
    accessSecret: secrets.jwtAccessSecret,
    refreshSecret: secrets.jwtRefreshSecret,
    emailVerificationSecret: secrets.emailVerificationSecret,
    accessExpire: (process.env.JWT_ACCESS_EXPIRES_IN ||
      '5m') as jwt.SignOptions['expiresIn'],
    refreshExpire: (process.env.JWT_REFRESH_EXPIRES_IN ||
      '30d') as jwt.SignOptions['expiresIn'],
    emailVerificationExpire: (process.env.JWT_EMAIL_VERIFICATION_EXPIRES_IN ||
      '5m') as jwt.SignOptions['expiresIn'],
  },
};

console.log(config);
