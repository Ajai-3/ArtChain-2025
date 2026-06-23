import { CommissionStatus } from '../../../../domain/entities/Commission';
import type { UserPublicProfile } from '../../../../types/user';

export type CommissionDTO = {
  id: string;
  requesterId: string;
  artistId: string;
  conversationId: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date | string;
  status: CommissionStatus;
  referenceImages: string[];
  finalArtwork?: string;
  finalImageUrl?: string;
  requesterAgreed?: boolean;
  artistAgreed?: boolean;
  history?: Array<{
    action: string;
    userId: string;
    timestamp: Date | string;
    details?: string;
  }>;
  lastUpdatedBy?: string;
  amount?: number;
  platformFee?: number;
  deliveryDate?: Date | string;
  autoReleaseDate?: Date | string;
  disputeReason?: string;
  platformFeePercentage?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  requester: Pick<UserPublicProfile, 'id' | 'name' | 'username' | 'profileImage'> | null;
  artist: Pick<UserPublicProfile, 'id' | 'name' | 'username' | 'profileImage'> | null;
};

export type ResolveDisputeResolution = 'REFUND' | 'RELEASE';

export interface IResolveCommissionDisputeUseCase {
  execute(id: string, resolution: ResolveDisputeResolution): Promise<CommissionDTO>;
}