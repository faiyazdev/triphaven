import { z } from "zod";

export const signupUserSchema = z.object({
  username: z.string().min(3).max(20).toLowerCase().trim(),
  name: z.string().min(2).max(50).trim(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(6).max(100),
});

export const signinUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Optional: export types inferred from schemas
export type SignupUserInput = z.infer<typeof signupUserSchema>;
export type SigninUserInput = z.infer<typeof signinUserSchema>;
