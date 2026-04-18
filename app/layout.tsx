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

const SITE_URL = "https://www.brunao.dev";
const SITE_NAME = "bruno.dev";
const SITE_TITLE = "Bruno Guimaraes — fullstack developer";
const SITE_DESCRIPTION =
  "Fullstack developer. Portfolio + blog living inside a terminal-flavored tiled workspace — 20 hidden features waiting to be found.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Bruno Guimaraes",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Bruno Guimaraes", url: SITE_URL }],
  creator: "Bruno Guimaraes",
  publisher: "Bruno Guimaraes",
  keywords: [
    "Bruno Guimaraes",
    "fullstack developer",
    "web engineer",
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "portfolio",
    "blog",
    "terminal UI",
  ],
  alternates: {
    canonical: "/",
  },
  // The actual <link rel="icon" | "apple-touch-icon"> tags are emitted
  // automatically by Next.js from the file-based conventions:
  //   app/favicon.ico      → multi-res (16/32/48) tab icon, fallback
  //   app/icon.png         → 192×192 modern PNG favicon
  //   app/apple-icon.png   → 180×180 iOS home-screen touch icon
  // The manifest below points Chrome/Android at public/icon-{192,512}.png
  // so PWA installs ("Add to Home Screen") get the right launcher icon.
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
