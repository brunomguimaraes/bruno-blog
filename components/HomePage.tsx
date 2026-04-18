"use client";

import { useCallback, useEffect, useRef } from "react";
import StatusBar from "@/components/StatusBar";
import CommandBar from "@/components/CommandBar";
import ColumnSplitter from "@/components/ColumnSplitter";
import {
  HeroPane,
  WhoamiPane,
  NowPane,
  BlogPane,
  ContactPane,
  RootPane,
} from "@/components/Panes";
import { useEasterEggs } from "@/components/easter-eggs/context";
import { useGamepad } from "@/components/easter-eggs/hooks";
import type { Post } from "@/lib/posts";
import type { NowEntry } from "@/lib/now";

const PANE_ORDER = ["hero", "whoami", "now", "blog", "contact"];

export default function HomePage({
  posts,
  nowEntries,
}: {
  posts: Post[];
  nowEntries: NowEntry[];
}) {
  const {
    zoomed,
    rootOn,
    focusedPane,
    setFocusedPane,
    setPaletteOpen,
    triggerStorm,
    triggerAlarm,
    toggleVerdant,
    discover,
    toast,
  } = useEasterEggs();
  const wmRef = useRef<HTMLDivElement>(null);

  // Always work with the latest focusedPane inside imperative handlers
  // (Tab and Gamepad both call into this ref).
  const focusedRef = useRef<string | null>(focusedPane);
  useEffect(() => {
    focusedRef.current = focusedPane;
  }, [focusedPane]);

  const cyclePane = useCallback(
    (dir: 1 | -1) => {
      const order = PANE_ORDER;
      const i = focusedRef.current ? order.indexOf(focusedRef.current) : -1;
      const next = order[(i + dir + order.length) % order.length];
      setFocusedPane(next);
      // Match by data attribute, not inline style. The old
      // `[style*="grid-area: ${next}"]` selector leaked CSS-specific
      // quirks (any whitespace/ordering change in React's style
      // serialization would silently break Tab cycling).
      const el = wmRef.current?.querySelector<HTMLElement>(
        `[data-pane-id="${next}"]`,
      );
      el?.focus();
    },
    [setFocusedPane],
  );

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
      cyclePane(e.shiftKey ? -1 : 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cyclePane]);

  // Pilot mode — Gamepad API. D-pad cycles panes, A opens the palette,
  // Y runs storm, B red-alert, X toggles anomaly. We discover "pilot-mode"
  // the first time a controller connects.
  useGamepad({
    onConnect: () => {
      discover("pilot-mode");
      toast({
        head: "pilot mode",
        msg: "controller detected.",
        sub: "D-pad cycles panes · A palette · Y storm · B alarm",
      });
    },
    onRight: () => cyclePane(1),
    onDown: () => cyclePane(1),
    onLeft: () => cyclePane(-1),
    onUp: () => cyclePane(-1),
    onA: () => setPaletteOpen(true),
    onY: () => triggerStorm(),
    onB: () => triggerAlarm(),
    onX: () => toggleVerdant(),
  });

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
        <NowPane entries={nowEntries} />
        <BlogPane posts={posts} />
        <ContactPane />
        <RootPane />
        <ColumnSplitter targetRef={wmRef} />
      </div>
      <CommandBar />
    </>
  );
}
