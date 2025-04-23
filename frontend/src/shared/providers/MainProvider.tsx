"use client";

import { type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "@/shared/config/store";
import { ThemeProvider, ToastProvider } from "./index";

export function MainProvider({ children }: PropsWithChildren<unknown>) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
        storageKey="teacoder-theme"
      >
        <ToastProvider />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
