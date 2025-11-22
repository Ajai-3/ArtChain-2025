import { z } from "zod";
import { ERROR_MESSAGES } from "../../constants/messages";

export const getMessagesSchema = z.object({
  query: z.object({
    fromId: z.string().optional(),
    limit: z
      .string()
      .default("10")
      .transform((v) => Number(v))
      .refine(
        (v) => Number.isInteger(v) && v > 0,
        ERROR_MESSAGES.LIMIT_MUST_BE_POSITIVE_INTEGER
      ),
  }),

  params: z.object({
    conversationId: z.string().min(1, ERROR_MESSAGES.CONVERSATION_ID_REQUIRED),
  }),

  headers: z.object({
    "x-user-id": z.string().min(1, ERROR_MESSAGES.X_USER_ID_HEADER_REQUIRED),
  }),
});

export type GetMessagesInput = z.infer<typeof getMessagesSchema>;
