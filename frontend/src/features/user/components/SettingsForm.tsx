"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Loading,
  Switch
} from "@/shared/components/ui"
import { useProfile } from "@/shared/auth/hooks"

import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation"
import { SettingsSchema, TypeSettingsSchema } from "../schemes"

import { UserButton } from "./UserButton"
import { PasswordField } from "@/shared/components/ui/PasswordField"

export function SettingsForm() {
  const { data: user, isLoading } = useProfile()

  const form = useForm<TypeSettingsSchema>({
    resolver: zodResolver(SettingsSchema),
    values: {
      name: user?.displayName || "",
      password: "",
      isTwoFactorEnabled: user?.isTwoFactorEnabled || false
    }
  })

  const { update, isLoadingUpdate } = useUpdateProfileMutation()

  const onSubmit = (values: TypeSettingsSchema) => {
    update(values)
  }

  if (!user) return null

  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to TodoList
      </Link>

      <Card className="w-[400px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Settings</CardTitle>
          <div className="h-10 w-10">
            <div>{user && <UserButton user={user} />}</div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-2 space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ivan"
                          disabled={isLoadingUpdate}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordField
                          placeholder="******"
                          disabled={isLoadingUpdate}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Two-factor auth</FormLabel>
                        <FormDescription>
                          Enable two-factor authentication for your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoadingUpdate}>
                  Save
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
