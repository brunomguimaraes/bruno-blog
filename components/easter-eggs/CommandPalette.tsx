"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEasterEggs } from "./context";

export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, commands, runCommand } = useEasterEggs();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [paletteOpen]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(needle) || c.id.includes(needle));
  }, [q, commands]);

  useEffect(() => {
    if (active >= filtered.length) setActive(0);
  }, [filtered.length, active]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + Math.max(1, filtered.length)) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) runCommand(cmd.id);
    }
  }

  return (
    <div
      className={"palette" + (paletteOpen ? " show" : "")}
      onClick={(e) => {
        if (e.target === e.currentTarget) setPaletteOpen(false);
      }}
      aria-hidden={!paletteOpen}
    >
      <div className="box" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="in">
          <span className="p">❯</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command…"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="results">
          {filtered.length === 0 ? (
            <div className="none">no match</div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={c.id}
                className={"row" + (i === active ? " active" : "")}
                onMouseEnter={() => setActive(i)}
                onClick={() => runCommand(c.id)}
              >
                <span className="ico">{c.ico}</span>
                <span className="lbl">{c.label}</span>
                {c.sh ? <span className="sh">{c.sh}</span> : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
