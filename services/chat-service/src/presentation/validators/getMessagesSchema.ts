import { z } from "zod";

export const getMessagesSchema = z.object({
  query: z.object({
    fromId: z.string().optional(),
    limit: z
      .string()
      .default("10")
      .transform((v) => Number(v))
      .refine(
        (v) => Number.isInteger(v) && v > 0,
        "limit must be a positive integer"
      ),
  }),

  params: z.object({
    conversationId: z.string().min(1, "conversationId is required"),
  }),

  headers: z.object({
    "x-user-id": z.string().min(1, "x-user-id header is required"),
  }),
});

export type GetMessagesInput = z.infer<typeof getMessagesSchema>;
