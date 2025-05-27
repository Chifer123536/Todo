"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type PropsWithChildren, useState } from "react"

export function TanstackQueryProvider({
  children
}: PropsWithChildren<unknown>) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false // Не делать refetch при возвращении на вкладку
        }
      }
    })
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
