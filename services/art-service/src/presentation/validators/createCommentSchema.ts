import { z } from "zod";

export const createCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  content: z.string().min(1, "Content is required").max(500, "Content is too long"),
});