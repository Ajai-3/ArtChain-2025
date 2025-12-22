import { z } from "zod";

export const getUsersBatchSchema = z.object({
  ids: z.array(z.string()).min(1, "ids must be a non-empty array of strings"),
  currentUserId: z.string().optional(),
});
