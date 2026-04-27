import type { Request } from 'express';
import type { UserPublicProfile } from './user';

export type RequestWithUser = Request & {
  user?: Partial<UserPublicProfile> & { _id?: string };
};

