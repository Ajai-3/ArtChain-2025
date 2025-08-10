import jwt from "jsonwebtoken";

export interface DecodedToken {
  name: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export class TokenService {
  constructor(private config: {
    accessSecret: string;
    refreshSecret: string;
    emailVerificationSecret: string;
    accessExpire: jwt.SignOptions['expiresIn'];
    refreshExpire: jwt.SignOptions['expiresIn'];
    emailVerificationExpire: jwt.SignOptions['expiresIn'];
  }) {}

  generateAccessToken(payload: object): string {
    const { exp, iat, ...cleanPayload } = payload as any;
    return jwt.sign(cleanPayload, this.config.accessSecret, {
      expiresIn: this.config.accessExpire,
    });
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.config.refreshSecret, {
      expiresIn: this.config.refreshExpire,
    });
  }

  verifyAccessToken(token: string): DecodedToken | null {
    try {
      return jwt.verify(token, this.config.accessSecret) as DecodedToken;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): DecodedToken | null {
    try {
      return jwt.verify(token, this.config.refreshSecret) as DecodedToken;
    } catch {
      return null;
    }
  }

  generateEmailVerificationToken(payload: object): string {
    return jwt.sign(payload, this.config.emailVerificationSecret, {
      expiresIn: this.config.emailVerificationExpire,
    });
  }

  verifyEmailVerificationToken(token: string): DecodedToken | null {
    try {
      return jwt.verify(token, this.config.emailVerificationSecret) as DecodedToken;
    } catch {
      return null;
    }
  }
}
