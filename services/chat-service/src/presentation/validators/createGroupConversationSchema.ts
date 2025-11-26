import { z } from "zod";

export const createGroupConversationSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  memberIds: z.array(z.string()).min(1, "At least one member is required"),
  userId: z.string().min(1, "User ID is required"),
});

export type CreateGroupConversationSchema = z.infer<
  typeof createGroupConversationSchema
>;
