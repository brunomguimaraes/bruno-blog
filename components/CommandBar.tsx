"use client";

import { useEasterEggs } from "@/components/easter-eggs/context";

export default function CommandBar() {
  const { setHelpOpen, setPaletteOpen, setQuakeOpen, discover } = useEasterEggs();

  return (
    <div className="cmd" role="toolbar" aria-label="keyboard shortcuts">
      <span className="p">❯</span>
      <span>bruno@milano:~</span>
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
          <kbd>⌃</kbd> + <kbd>`</kbd> console
        </span>
        <span>
          <kbd>Tab</kbd> focus · <kbd>Enter</kbd> zoom
        </span>
      </span>
    </div>
  );
}
