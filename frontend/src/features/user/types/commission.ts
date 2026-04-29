export interface Commission {
  id: string;
  title: string;
  description?: string;
  status: string;
  budget?: number;
  deadline?: string;
  requesterId?: string;
  artistId?: string;
  requester?: {
    id: string;
    username?: string;
    name?: string;
    profileImage?: string;
  };
  artist?: {
    id: string;
    username?: string;
    name?: string;
    profileImage?: string;
  };
  requesterAgreed?: boolean;
  artistAgreed?: boolean;
  disputeReason?: string;
  finalArtwork?: string;
  finalImageUrl?: string;
  referenceImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CommissionResponse {
  active?: Commission;
  history?: Array<{
    status: string;
    createdAt: string;
    note?: string;
  }>;
}
