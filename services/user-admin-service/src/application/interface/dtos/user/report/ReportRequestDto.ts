export interface ReportRequestDto {
    reporterId: string;
    targetId: string;
    targetType: 'art' | 'comment' | 'user';
    reason: string;
    description?: string;
}   