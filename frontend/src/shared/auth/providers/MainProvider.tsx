"use client";

import { type PropsWithChildren } from "react";

import { ThemeProvider, ToastProvider } from "./index";

export function MainProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      storageKey="teacoder-theme"
    >
      <ToastProvider />
      {children}
    </ThemeProvider>
  );
}
