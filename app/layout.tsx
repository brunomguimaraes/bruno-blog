import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import GlobalShell from "@/components/GlobalShell";
import "./globals.css";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bruno Guimaraes — fullstack developer",
  description:
    "Portfolio + blog. Matrix-but-blue aesthetic with a tiled workspace layout. 13 hidden features.",
  openGraph: {
    title: "Bruno Guimaraes — fullstack developer",
    description: "Portfolio + blog. Matrix-but-blue.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#02040a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={mono.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GlobalShell>{children}</GlobalShell>
      </body>
    </html>
  );
}
