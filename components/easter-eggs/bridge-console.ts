"use client";

/**
 * Fancy console output for the "engineer's console" egg.
 * Used from provider.tsx once we detect DevTools has opened.
 *
 * Keep strings here so the provider stays focused on state + effects.
 */

import type { RainDirection } from "./context";

const CYAN = "color:#89e6ff;font-family:JetBrains Mono, ui-monospace, monospace;";
const BLUE = "color:#1aa3ff;font-family:JetBrains Mono, ui-monospace, monospace;";
const MUTED = "color:#7ba0c4;font-family:JetBrains Mono, ui-monospace, monospace;";
const PILL =
  "color:#02040a;background:#89e6ff;padding:2px 8px;border-radius:3px;" +
  "font-weight:700;font-family:JetBrains Mono, ui-monospace, monospace;";

export function printBridgeBanner(): void {
  if (typeof console === "undefined") return;
  // One-line pill + ASCII art, printed as a group so it collapses cleanly.
  /* eslint-disable no-console */
  console.log("%c bruno@bridge ", PILL);
  console.log(
    `%c
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║                  Welcome to the bridge, Engineer.            ║
    ║                                                              ║
    ║      The warp drive is calm. The kitchen is clean.           ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝`,
    CYAN,
  );
  console.log(
    "%cThe console is rigged. Try %cwindow.bruno.help()%c to see what's wired.",
    BLUE,
    PILL,
    BLUE,
  );
  console.log(
    "%c(nothing here phones home — everything runs client-side.)",
    MUTED,
  );
  /* eslint-enable no-console */
}

export function printBrunoHelp(): void {
  if (typeof console === "undefined") return;
  /* eslint-disable no-console */
  console.log(
    `%c
    bruno@bridge commands:

      bruno.help()         show this screen
      bruno.eggs()         list all eggs (discovered + hidden)
      bruno.storm()        weapons free — 5s of chaos
      bruno.alarm()        red alert drill
      bruno.verdant()      toggle anomaly mode
      bruno.warp("forward"|"paused"|"reverse")
      bruno.dock()         dock at /hollow
      bruno.saver()        deep-space drift
      bruno.source         github url
    `,
    CYAN,
  );
  /* eslint-enable no-console */
}

export type BridgeApi = {
  storm: () => void;
  alarm: () => void;
  verdant: () => void;
  warp: (d: RainDirection) => void;
  dock: () => void;
  saver: () => void;
  listEggs: () => Array<{ id: string; label: string; found: boolean }>;
};

export const BRIDGE_SOURCE_URL =
  "https://github.com/brunomguimaraes/bruno-blog";
