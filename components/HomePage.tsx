"use client";

import { useEffect, useRef } from "react";
import StatusBar from "@/components/StatusBar";
import CommandBar from "@/components/CommandBar";
import {
  HeroPane,
  WhoamiPane,
  NowPane,
  BlogPane,
  ContactPane,
  RootPane,
} from "@/components/Panes";
import { useEasterEggs } from "@/components/easter-eggs/context";
import type { Post } from "@/lib/posts";

const PANE_ORDER = ["hero", "whoami", "now", "blog", "contact"];

export default function HomePage({ posts }: { posts: Post[] }) {
  const { zoomed, rootOn, focusedPane, setFocusedPane } = useEasterEggs();
  const wmRef = useRef<HTMLDivElement>(null);

  // mark html as home so the idle screensaver only fires here
  useEffect(() => {
    document.documentElement.dataset.home = "1";
    return () => {
      delete document.documentElement.dataset.home;
    };
  }, []);

  // Tab cycling between panes
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      e.preventDefault();
      const order = PANE_ORDER;
      const i = focusedPane ? order.indexOf(focusedPane) : -1;
      const dir = e.shiftKey ? -1 : 1;
      const next = order[(i + dir + order.length) % order.length];
      setFocusedPane(next);
      // move DOM focus too so Enter-zoom feels right
      const el = wmRef.current?.querySelector<HTMLElement>(`[style*="grid-area: ${next}"]`);
      el?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedPane, setFocusedPane]);

  const wmClass =
    "wm" +
    (zoomed ? " zoomed" : "") +
    (rootOn ? " root-on" : "");

  return (
    <>
      <StatusBar />
      <div className={wmClass} ref={wmRef}>
        <HeroPane />
        <WhoamiPane />
        <NowPane />
        <BlogPane posts={posts} />
        <ContactPane />
        <RootPane />
      </div>
      <CommandBar />
    </>
  );
}
