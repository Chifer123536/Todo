import { z } from "zod";

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export type TypeResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
