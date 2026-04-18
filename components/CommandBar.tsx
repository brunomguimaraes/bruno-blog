"use client";

import { useEffect, useRef } from "react";
import { useEasterEggs } from "@/components/easter-eggs/context";

export default function CommandBar() {
  const { setHelpOpen, setPaletteOpen, setQuakeOpen, discover } = useEasterEggs();
  const barRef = useRef<HTMLDivElement>(null);

  // Publish the bar's real height as a CSS var so .wm can reserve exactly
  // enough bottom padding, even when flex-wrap makes it taller on narrow screens.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const publish = () => {
      document.documentElement.style.setProperty(
        "--cmd-h",
        `${el.offsetHeight}px`,
      );
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    window.addEventListener("resize", publish);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", publish);
    };
  }, []);

  return (
    <div className="cmd" ref={barRef} role="toolbar" aria-label="keyboard shortcuts">
      <span className="p">❯</span>
      <span>bruno@bridge:~</span>
      <span className="b">
        <span
          onClick={() => { setPaletteOpen(true); discover("palette"); }}
          style={{ cursor: "pointer" }}
        >
          <kbd>⌘</kbd> + <kbd>K</kbd> controls
        </span>
        <span
          onClick={() => { setHelpOpen(true); discover("help"); }}
          style={{ cursor: "pointer" }}
        >
          <kbd>?</kbd> manual
        </span>
        <span
          onClick={() => { setQuakeOpen(true); discover("quake"); }}
          style={{ cursor: "pointer" }}
        >
          <kbd>`</kbd> console
        </span>
        <span className="tab-hint">
          <kbd>Tab</kbd> focus · <kbd>Enter</kbd> zoom
        </span>
      </span>
    </div>
  );
}
