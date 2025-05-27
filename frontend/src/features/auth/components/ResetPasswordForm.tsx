"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import { useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/shared/components/ui"

import { useResetPasswordMutation } from "../hooks"
import { ResetPasswordSchema, TypeResetPasswordSchema } from "../schemes"

import { AuthWrapper } from "./AuthWrapper"

export function ResetPasswordForm() {
  const { theme } = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

  const form = useForm<TypeResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  const { reset, isLoadingReset } = useResetPasswordMutation()

  const onSubmit = (values: TypeResetPasswordSchema) => {
    if (recaptchaValue) {
      reset({ values, recaptcha: recaptchaValue })
    } else {
      toast.error("Please complete the reCAPTCHA")
    }
  }

  return (
    <AuthWrapper
      heading="Reset Password"
      description="Enter your email to reset your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-2 space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    disabled={isLoadingReset}
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
              onChange={setRecaptchaValue}
              theme={theme === "light" ? "light" : "dark"}
            />
          </div>
          <Button type="submit" disabled={isLoadingReset}>
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}
