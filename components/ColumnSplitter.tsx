"use client";

import { useEffect, useRef, useState } from "react";
import { useEasterEggs } from "@/components/easter-eggs/context";

/**
 * A draggable vertical gutter between the two workspace columns. Drives
 * the --wm-col1 / --wm-col2 custom properties on the target element, and
 * persists the chosen ratio in the URL hash as `col=<ratio>`. Loads the
 * ratio from the hash on mount so people can share their layout by
 * copy-pasting the URL.
 *
 * The "reconfigure" egg fires the first time a drag finishes.
 *
 * External code (e.g. the command palette's "reset bulkheads" action)
 * can broadcast a `bruno:reset-layout` window event; the splitter listens
 * and snaps back to the default ratio.
 */
export const RESET_LAYOUT_EVENT = "bruno:reset-layout";

const MIN = 0.25;
const MAX = 0.8;
export const DEFAULT_COL_RATIO = 0.565; // matches the original 1.3fr : 1fr

export function readColRatioFromHash(): number {
  if (typeof window === "undefined") return DEFAULT_COL_RATIO;
  const m = /(?:^|[#&])col=([\d.]+)/.exec(window.location.hash);
  if (!m) return DEFAULT_COL_RATIO;
  const v = parseFloat(m[1]);
  if (!Number.isFinite(v)) return DEFAULT_COL_RATIO;
  return Math.min(MAX, Math.max(MIN, v));
}

function writeHash(r: number): void {
  if (typeof window === "undefined") return;
  const next =
    Math.abs(r - DEFAULT_COL_RATIO) < 0.01
      ? window.location.pathname + window.location.search
      : `${window.location.pathname}${window.location.search}#col=${r.toFixed(3)}`;
  window.history.replaceState(null, "", next);
}

type Props = {
  targetRef: React.RefObject<HTMLElement | null>;
};

export default function ColumnSplitter({ targetRef }: Props) {
  const { discover, toast } = useEasterEggs();
  const [ratio, setRatio] = useState<number>(() => readColRatioFromHash());
  const draggingRef = useRef(false);
  const firedOnceRef = useRef(false);
  const ratioRef = useRef(ratio);

  useEffect(() => {
    ratioRef.current = ratio;
    const wm = targetRef.current;
    if (!wm) return;
    wm.style.setProperty("--wm-col1", `${ratio}fr`);
    wm.style.setProperty("--wm-col2", `${1 - ratio}fr`);
  }, [ratio, targetRef]);

  // Global pointer listeners; only do work while dragging.
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!draggingRef.current) return;
      const wm = targetRef.current;
      if (!wm) return;
      const rect = wm.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const r = Math.min(MAX, Math.max(MIN, x / rect.width));
      setRatio(r);
    }
    function onUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      writeHash(ratioRef.current);
      if (!firedOnceRef.current) {
        firedOnceRef.current = true;
        discover("reconfigure");
        toast({
          head: "bulkheads reconfigured",
          msg: "your layout lives in the URL now.",
          sub: "share the tab — it'll open the same way.",
        });
      }
    }
    function onKey(e: KeyboardEvent) {
      // keyboard nudging when the handle has focus (arrow left / right)
      const ae = document.activeElement as HTMLElement | null;
      if (!ae || !ae.classList.contains("wm-splitter-col")) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const delta = e.key === "ArrowLeft" ? -0.02 : 0.02;
      setRatio((r) => {
        const next = Math.min(MAX, Math.max(MIN, r + delta));
        writeHash(next);
        return next;
      });
      if (!firedOnceRef.current) {
        firedOnceRef.current = true;
        discover("reconfigure");
      }
    }
    function onReset() {
      setRatio(DEFAULT_COL_RATIO);
      writeHash(DEFAULT_COL_RATIO);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener(RESET_LAYOUT_EVENT, onReset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(RESET_LAYOUT_EVENT, onReset);
    };
  }, [discover, toast, targetRef]);

  return (
    <div
      className="wm-splitter wm-splitter-col"
      style={{ left: `calc(${ratio * 100}% - 4px)` }}
      onPointerDown={(e) => {
        e.preventDefault();
        draggingRef.current = true;
        (e.currentTarget as HTMLElement).focus();
      }}
      role="separator"
      aria-orientation="vertical"
      aria-label="resize workspace columns"
      aria-valuemin={MIN * 100}
      aria-valuemax={MAX * 100}
      aria-valuenow={Math.round(ratio * 100)}
      tabIndex={0}
    />
  );
}
