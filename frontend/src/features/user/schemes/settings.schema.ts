import { z } from "zod";

export const SettingsSchema = z.object({
  name: z.string().min(1, {
    message: "Enter your name",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
  isTwoFactorEnabled: z.boolean(),
});

export type TypeSettingsSchema = z.infer<typeof SettingsSchema>;
