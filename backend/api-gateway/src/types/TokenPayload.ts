import { Request } from 'express';

export interface TokenPayload {
  id: string;
  role: 'user' | 'artist' | 'admin';
  email?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}