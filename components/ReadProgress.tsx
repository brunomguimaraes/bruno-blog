"use client";

import { useEffect, useRef } from "react";
import { useEasterEggs } from "@/components/easter-eggs/context";

/**
 * A 2px reading-progress bar at the top of the viewport, tied to the
 * document's scroll progress via `animation-timeline: scroll()`. Pure CSS
 * on modern Chromium/WebKit — no scroll listener, no React state churn.
 *
 * The component also drops a sentinel near the bottom of the article;
 * when it crosses into view we fire the "scroll-telemetry" egg.
 */
export default function ReadProgress() {
  const { discover, toast } = useEasterEggs();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            discover("scroll-telemetry");
            toast({
              head: "end of log",
              msg: "thanks for reading.",
              sub: "you made it to the bottom.",
            });
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [discover, toast]);

  return (
    <>
      <div className="read-progress" aria-hidden />
      <div ref={sentinelRef} className="read-end-sentinel" aria-hidden />
    </>
  );
}
