import { z } from "zod";
import { ERROR_MESSAGES } from "../../constants/messages";

export const createPrivateConversationSchema = z
  .object({
    userId: z.string(),
    otherUserId: z.string(),
  })
  .refine((data) => data.userId !== data.otherUserId, {
    message: ERROR_MESSAGES.USER_ID_OTHER_USER_ID_CANNOT_BE_SAME,
    path: ["otherUserId"],
  });

export type CreatePrivateConversationInput = z.infer<
  typeof createPrivateConversationSchema
>;
