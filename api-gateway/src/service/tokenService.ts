import { config } from "../config/env";
import { TokenService } from "art-chain-shared";

export const tokenService = new TokenService({
  accessSecret: config.jwt.accessSecret,
  accessExpire: config.jwt.accessExpire,
  refreshSecret: config.jwt.refreshSecret,
  refreshExpire: config.jwt.refreshExpire,
  emailVerificationSecret: config.jwt.emailVerificationSecret,
  emailVerificationExpire: config.jwt.emailVerificationExpire,
});