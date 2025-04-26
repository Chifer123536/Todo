import { MainProvider } from "@/shared/providers";
import { Navbar } from "@/widgets/Navbar";
import "../shared/styles/global.scss";
import "../shared/styles/global.css";

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
          {children}
        </MainProvider>
      </body>
    </html>
  );
}
