import { MainProvider } from "@/shared/providers";
import { Navbar } from "@/widgets/Navbar";
import "@/shared/styles/global.scss";

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
    <html lang="en">
      <body>
        <MainProvider>
          <Navbar />
          {children}
        </MainProvider>
      </body>
    </html>
  );
}
