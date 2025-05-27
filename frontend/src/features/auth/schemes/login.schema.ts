import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  }),
  code: z.optional(z.string())
})

export type TypeLoginSchema = z.infer<typeof LoginSchema>
