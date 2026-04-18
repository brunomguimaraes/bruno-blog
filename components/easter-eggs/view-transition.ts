"use client";

import { flushSync } from "react-dom";

// View Transitions API isn't in lib.dom's stable surface yet.
type StartViewTransition = (cb: () => void | Promise<void>) => {
  finished: Promise<void>;
  ready: Promise<void>;
};

/**
 * Run a React state update inside document.startViewTransition() so the
 * browser morphs between the old and new DOM snapshots. Uses flushSync to
 * guarantee the update lands before the browser takes its "after" snapshot.
 *
 * Silently no-ops (still applies the update) when the API is unavailable,
 * which covers Safari and older Firefox.
 */
export function withViewTransition(update: () => void): void {
  const d = typeof document !== "undefined"
    ? (document as Document & { startViewTransition?: StartViewTransition })
    : null;
  if (!d || typeof d.startViewTransition !== "function") {
    update();
    return;
  }
  d.startViewTransition(() => {
    flushSync(() => {
      update();
    });
  });
}
