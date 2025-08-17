import { TokenService } from 'art-chain-shared';
import { config } from '../../infrastructure/config/env';

export const tokenService = new TokenService({
  accessSecret: config.jwt.accessSecret,
  accessExpire: config.jwt.accessExpire,
  refreshSecret: config.jwt.refreshSecret,
  refreshExpire: config.jwt.refreshExpire,
  emailVerificationSecret: config.jwt.emailVerificationSecret,
  emailVerificationExpire: config.jwt.emailVerificationExpire,
});
