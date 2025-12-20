import { injectable } from "inversify";
import { tokenService } from "../../presentation/service/token.service";
import {
  IAccessTokenVerifier,
} from "../../application/interface/auth/IAccessTokenVerifier";
import { IRefreshTokenVerifier } from "../../application/interface/auth/IRefreshTokenVerifier";
import { IEmailTokenVerifier } from "../../application/interface/auth/IEmailTokenVerifier";
import { ITokenGenerator } from "../../application/interface/auth/ITokenGenerator";

@injectable()
export class JwtTokenAdapter
  implements
    IAccessTokenVerifier,
    IRefreshTokenVerifier,
    IEmailTokenVerifier,
    ITokenGenerator
{
  verify(token: string) {
    return tokenService.verifyRefreshToken(token);
  }

  verifyAccess(token: string) {
    return tokenService.verifyAccessToken(token);
  }

  verifyEmail(token: string) {
    return tokenService.verifyEmailVerificationToken(token);
  }

  generateAccess(payload: object) {
    return tokenService.generateAccessToken(payload);
  }

  generateRefresh(payload: object) {
    return tokenService.generateRefreshToken(payload);
  }

  generateEmailVerification(payload: object) {
    return tokenService.generateEmailVerificationToken(payload);
  }
}
