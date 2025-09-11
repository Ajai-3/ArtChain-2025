import 'dotenv-flow/config';
import jwt from 'jsonwebtoken';
import { getArtChainSecrets } from 'art-chain-shared';

const secrets = await getArtChainSecrets();


export const config = {
  port: process.env.PORT || '3001',
  frontend_URL: process.env.FRONTEND_URL,
  rabbitmq_URL: process.env.RABBITMQ_URL || '',
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
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  },
   grpc: {
    host: process.env.ELASTIC_GRPC_HOST || 'localhost',
    port: process.env.ELASTIC_GRPC_PORT || '50051',
  },
};

console.log(config);
