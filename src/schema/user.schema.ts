import z from "zod";

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
