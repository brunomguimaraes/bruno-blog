"use client";

import { useEasterEggs } from "./context";
import { EGGS } from "./config";

export default function HelpOverlay() {
  const { helpOpen, setHelpOpen, discovered } = useEasterEggs();

  return (
    <div
      className={"overlay" + (helpOpen ? " show" : "")}
      onClick={(e) => {
        if (e.target === e.currentTarget) setHelpOpen(false);
      }}
      aria-hidden={!helpOpen}
    >
      <div className="panel" role="dialog" aria-modal="true" aria-label="Shortcuts help">
        <header>
          <span className="t">bruno@bridge:~</span>
          <span>bridge manual — hidden features</span>
          <span className="x" onClick={() => setHelpOpen(false)} role="button" aria-label="close">
            ✕
          </span>
        </header>
        <div className="b">
          <div style={{ marginBottom: 14, color: "var(--dim)", fontSize: 12 }}>
            Discovered <strong style={{ color: "var(--accent)" }}>{discovered.size}</strong>/{EGGS.length}.
            Keep poking.
          </div>
          <div className="shortcut-list">
            {EGGS.map((e) => {
              const found = discovered.has(e.id);
              return (
                <div key={e.id} style={{ display: "contents" }}>
                  <span className="k" style={{ opacity: found ? 1 : 0.55 }}>{e.key}</span>
                  <span className="d" style={{ opacity: found ? 1 : 0.55 }}>
                    {found ? e.label : "???"} <em>— {found ? e.hint : "not yet"}</em>
                  </span>
                </div>
              );
            })}
            <span className="sec">basics</span>
            <span className="k">Esc</span>
            <span className="d">Close any overlay <em>— including the quake terminal</em></span>
            <span className="k">Tab</span>
            <span className="d">Cycle pane focus <em>— then Enter to zoom</em></span>
          </div>
        </div>
      </div>
    </div>
  );
}
