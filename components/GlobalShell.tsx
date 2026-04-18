"use client";

import EasterEggsProvider from "@/components/easter-eggs/provider";

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  return <EasterEggsProvider>{children}</EasterEggsProvider>;
}
