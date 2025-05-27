"use client"

import { Toaster } from "@/shared/components/ui"

export function ToastProvider() {
  return <Toaster position="top-center" duration={2000} />
}
