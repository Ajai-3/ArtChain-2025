export type ReportTargetType = 'ART' | 'COMMENT' | 'USER';

export type ReportReason = 
  | 'inappropriate'
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'other';

export type ReportStatus = 
  | 'pending'
  | 'reviewed'
  | 'resolved'
  | 'dismissed';

export class Report {
  constructor(
    public readonly id: string,
    public readonly reporterId: string,
    public readonly targetId: string,
    public readonly targetType: ReportTargetType,
    public readonly reason: ReportReason,
    public readonly description: string | null,
    public readonly status: ReportStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
