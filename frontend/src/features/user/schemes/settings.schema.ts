import { z } from "zod"

export const SettingsSchema = z.object({
  name: z.string().min(1, {
    message: "Enter your name"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  }),
  isTwoFactorEnabled: z.boolean()
})

export type TypeSettingsSchema = z.infer<typeof SettingsSchema>
