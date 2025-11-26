import { z } from "zod";

export const ReportRequestSchema = z.object({
    reporterId: z.string(),
    targetId: z.string(),
    targetType: z.enum(['art', 'comment', 'user']),
    reason: z.string(),
    description: z.string().optional(),
});

export type ReportRequest = z.infer<typeof ReportRequestSchema>;
