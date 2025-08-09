import { MainProvider } from "@/shared/providers"
import { Navbar } from "@/widgets/Navbar"
import "@/shared/styles/global.scss"
import "@/shared/styles/global.css"
import { ToggleThemeWrapper } from "@/shared/components/ui/ToggleThemeWrapper"
import Script from "next/script"

export const metadata = {
  metadataBase: new URL("https://todolist.chifer123536.ru"),
  icons: { icon: "/favicon.png" }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://todolist.chifer123536.ru",
              name: "Todo List",
              description: "Manage your tasks with Todo List"
            })
          }}
        />
      </head>
      <body>
        <MainProvider>
          <Navbar />
          <ToggleThemeWrapper />
          <main className="min-h-screen w-full px-4 pt-[10vh] flex items-center justify-center">
            {children}
          </main>
        </MainProvider>
      </body>
    </html>
  )
}
