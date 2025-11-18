import { z } from "zod";

export const createPrivateConversationSchema = z
  .object({
    userId: z.string(),
    otherUserId: z.string(),
  })
  .refine((data) => data.userId !== data.otherUserId, {
    message: "userId and otherUserId cannot be the same",
    path: ["otherUserId"],
  });

export type CreatePrivateConversationInput = z.infer<
  typeof createPrivateConversationSchema
>;
