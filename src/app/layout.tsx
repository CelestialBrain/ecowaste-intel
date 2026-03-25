import type { Metadata } from "next";
import { IBM_Plex_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThemeProvider from "@/components/ThemeProvider";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EcoWaste Intel — BCG Dashboard",
  description:
    "Intelligence dashboard for EcoWaste Coalition by BCG · Blue Consulting Group · Ateneo de Manila University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <ThemeProvider>
          <Sidebar />
          <main className="flex-1 md:ml-0 mt-12 md:mt-0 overflow-auto">
            <div className="p-6 md:px-10 md:py-8 max-w-[1400px]">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
