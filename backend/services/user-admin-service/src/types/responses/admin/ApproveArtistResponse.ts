import { SafeUser } from '../../../domain/entities/User';

export interface ApproveArtistResponse {
  user: SafeUser | null;
  request: void;
}