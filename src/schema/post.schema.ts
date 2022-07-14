import z from "zod";

export const createPostSchema = z.object({
  title: z.string().max(256, "Title is too long"),
  body: z.string().min(10),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const getSinglePostSchema = z.object({
  postId: z.string().uuid(),
});
