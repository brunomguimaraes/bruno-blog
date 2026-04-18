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

// The "recon in the source" egg. Viewable via View Source / curl / devtools
// Elements tab. Mentions a typed word — the actual discovery fires only once
// the user types it. See components/easter-eggs/provider.tsx for the trigger.
const SOURCE_BANNER = `
<!--
  ╔══════════════════════════════════════════════════════════════════╗
  ║                                                                  ║
  ║   welcome to the bridge.                                         ║
  ║                                                                  ║
  ║   if you're reading the source, you already know the game.       ║
  ║   press "?" on the homepage for the bridge manual. there are     ║
  ║   20 things to find — a couple of them only live down here.      ║
  ║                                                                  ║
  ║   you've found one. type "stowaway" anywhere on the site to      ║
  ║   log it.                                                        ║
  ║                                                                  ║
  ║   — bruno                                                        ║
  ║                                                                  ║
  ╚══════════════════════════════════════════════════════════════════╝
-->
`;

export const metadata: Metadata = {
  title: "Bruno Guimaraes — fullstack developer",
  description:
    "Portfolio + blog. A terminal-flavored tiled workspace with 20 hidden features baked in.",
  openGraph: {
    title: "Bruno Guimaraes — fullstack developer",
    description: "Portfolio + blog. Tiled panes, blue warp drive.",
    type: "website",
  },
  other: {
    "x-bridge-hello":
      "curious traveler — press ? on the homepage. try typing: stowaway",
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
        {/* HTML comment banner for view-source spelunkers */}
        <div
          aria-hidden
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: SOURCE_BANNER }}
        />
        <GlobalShell>{children}</GlobalShell>
      </body>
    </html>
  );
}
