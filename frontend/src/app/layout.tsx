import { MainProvider } from "@/shared/providers";
import { Navbar } from "@/widgets/Navbar";
import "../shared/styles/global.scss";
import "../shared/styles/global.css";
import { ToggleThemeWrapper } from "@/shared/components/ui/ToggleThemeWrapper";

export const metadata = {
  title: "Todo App",
  description: "Manage your tasks easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
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
  );
}
