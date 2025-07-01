"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import Link from "next/link"
import React, { memo, useCallback, useEffect, useState } from "react"
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

import { useLoginMutation } from "../hooks/useLoginMutation"
import { useResend2faMutation } from "../hooks/useResend2faMutation"
import { LoginSchema, TypeLoginSchema } from "../schemes"

import { AuthWrapper } from "./AuthWrapper"
import { PasswordField } from "@/shared/components/ui/PasswordField"

interface ResendButtonProps {
  resendCooldown: number
  isResending: boolean
  onClick: () => void
}

const ResendButton = memo(function ResendButton({
  resendCooldown,
  isResending,
  onClick
}: ResendButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isResending || resendCooldown > 0}
      onClick={onClick}
    >
      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
    </Button>
  )
})

export function LoginForm() {
  const { theme } = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [isShowTwoFactor, setIsShowFactor] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: ""
    }
  })

  const { login, confirm2fa, isLoadingLogin, isLoading2fa } =
    useLoginMutation(setIsShowFactor)

  const { resend, isResending } = useResend2faMutation()

  useEffect(() => {
    if (!isShowTwoFactor || resendCooldown === 0) return

    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isShowTwoFactor, resendCooldown])

  const handleResendCode = useCallback(() => {
    resend()
    setResendCooldown(10)
  }, [resend])

  const onSubmit = (values: TypeLoginSchema) => {
    if (isShowTwoFactor) {
      if (!values.code) {
        toast.error("Enter the verification code")
        return
      }
      confirm2fa(values.code)
    } else {
      if (recaptchaValue) {
        login({ values, recaptcha: recaptchaValue })
      } else {
        toast.error("Please complete the reCAPTCHA")
      }
    }
  }

  return (
    <AuthWrapper
      heading="Log In"
      description="Enter your email and password to sign in"
      backButtonLabel="Don’t have an account? Register"
      backButtonHref="/auth/register"
      isShowSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-2 space-y-2"
        >
          {isShowTwoFactor ? (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      disabled={isLoading2fa}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="mt-2 flex items-center space-x-2">
                    <ResendButton
                      resendCooldown={resendCooldown}
                      isResending={isResending}
                      onClick={handleResendCode}
                    />
                  </div>
                </FormItem>
              )}
            />
          ) : (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ivan@example.com"
                        disabled={isLoadingLogin}
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/auth/reset-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordField
                        placeholder="******"
                        disabled={isLoadingLogin}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={
                    process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY as string
                  }
                  onChange={setRecaptchaValue}
                  theme={theme === "light" ? "dark" : "light"}
                />
              </div>
            </>
          )}
          <Button type="submit" disabled={isLoadingLogin || isLoading2fa}>
            {isShowTwoFactor ? "Confirm Code" : "Sign In"}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}
