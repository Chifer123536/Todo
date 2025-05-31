import { MainProvider } from "@/shared/providers"
import { Navbar } from "@/widgets/Navbar"
import "@/shared/styles/global.scss"
import "@/shared/styles/global.css"
import { ToggleThemeWrapper } from "@/shared/components/ui/ToggleThemeWrapper"

export const metadata = {
  title: "Todo App – Manage Your Tasks",
  description: "Todo App on React/Next.js.",
  metadataBase: new URL("https://yourdomain.com"),
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.png" },

  openGraph: {
    type: "website",
    siteName: "Todo App",
    title: "Todo App – Manage Your Tasks",
    description: "Todo App on React/Next.js.",
    url: "https://yourdomain.com/",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Todo App Screenshot"
      }
    ],
    locale: "en_US"
  }
}

const jsonLd = `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://yourdomain.com/",
  "name": "Todo List",
  "description": "Manage your tasks with Todo List"
}`

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
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
