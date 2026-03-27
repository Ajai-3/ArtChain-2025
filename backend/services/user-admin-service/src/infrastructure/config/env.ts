import 'dotenv-flow/config';
import jwt from 'jsonwebtoken';
// import { getArtChainSecrets } from "art-chain-shared";

// COMMENTED OUT: AWS Secrets Manager (AWS credentials not working)
// const secrets = await getArtChainSecrets("ArtChainCommonSecret");

const secrets = {
  aws_cdn_domain:
    process.env.AWS_CDN_DOMAIN || 'your-cdn-domain-here.cloudfront.net',
  jwtAccessSecret:
    process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-here',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-here',
  emailVerificationSecret:
    process.env.JWT_EMAIL_VERIFICATION_SECRET ||
    'your-email-verification-secret-key-here',
};

export const config = {
  port: process.env.PORT || '4001',
  database_URL: process.env.DATABASE_URL,
  frontend_URL: process.env.FRONTEND_URL,
  aws_cdn_domain: secrets.aws_cdn_domain,
  rabbitmq_URL: process.env.RABBITMQ_URL || '',
  api_gateway_URL: process.env.API_GATEWAY_URL || '',
  isProduction: process.env.NODE_ENV === 'production',
  jwt: {
    accessSecret: secrets.jwtAccessSecret,
    refreshSecret: secrets.jwtRefreshSecret,
    emailVerificationSecret: secrets.emailVerificationSecret,
    accessExpire: (process.env.JWT_ACCESS_EXPIRES_IN ||
      '5m') as jwt.SignOptions['expiresIn'],
    refreshExpire: (process.env.JWT_REFRESH_EXPIRES_IN ||
      '30d') as jwt.SignOptions['expiresIn'],
    emailVerificationExpire: (process.env.EMAIL_EXPIRES_IN ||
      '5m') as jwt.SignOptions['expiresIn'],
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  },
  loki: {
    host: process.env.LOKI_HOST || '',
    user: process.env.LOKI_USER || '',
    token: process.env.LOKI_TOKEN || '',
  },
};
