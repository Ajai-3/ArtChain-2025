import { z } from "zod";

export const updateArtStatusSchema = z.object({
  status: z.enum(["active", "archived", "deleted"], {
    message: "Invalid status. Must be one of: active, archived, deleted",
  }),
});
