export interface PrismaModelDelegate {
  create(params: { data: Record<string, unknown> }): Promise<Record<string, unknown>>;
  update(params: { where: { id: string }; data: Record<string, unknown> }): Promise<Record<string, unknown>>;
  delete(params: { where: { id: string } }): Promise<unknown>;
  findUnique(params: { where: { id: string } }): Promise<Record<string, unknown> | null>;
  findMany(params?: Record<string, unknown>): Promise<Record<string, unknown>[]>;
  count(params?: Record<string, unknown>): Promise<number>;
}

export interface ArtistRequestCreateInput {
  userId: string;
  status?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string | null;
}

export interface ReportCreateInput {
  reporterId: string;
  targetId: string;
  targetType: 'ART' | 'COMMENT' | 'USER';
  reason: 'inappropriate' | 'spam' | 'harassment' | 'hate_speech' | 'other';
  description?: string | null;
}

export interface SupporterMapping {
  supporter: string;
}

export interface SupportingMapping {
  targetUser: string;
}

export interface ReportWithReporter {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  reporter?: {
    id: string;
    name: string;
    username: string;
    profileImage: string | null;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}