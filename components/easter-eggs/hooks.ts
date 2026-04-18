"use client";

import { useEffect, useRef } from "react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonami(onTrigger: () => void) {
  const pos = useRef(0);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = KONAMI[pos.current];
      if (k === expected) {
        pos.current += 1;
        if (pos.current === KONAMI.length) {
          pos.current = 0;
          onTrigger();
        }
      } else {
        // start over but keep first match if the current key matches the first step
        pos.current = k === KONAMI[0] ? 1 : 0;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTrigger]);
}

export function useTypedWords(words: Record<string, () => void>) {
  const buf = useRef("");
  useEffect(() => {
    const keys = Object.keys(words);
    const maxLen = Math.max(...keys.map((w) => w.length), 1);
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length !== 1) return;
      buf.current = (buf.current + e.key.toLowerCase()).slice(-maxLen);
      for (const w of keys) {
        if (buf.current.endsWith(w.toLowerCase())) {
          buf.current = "";
          words[w]();
          break;
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [words]);
}

export function useIdle(ms: number, onIdle: () => void, onWake?: () => void) {
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    let idle = false;

    function wake() {
      if (idle && onWake) onWake();
      idle = false;
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        idle = true;
        onIdle();
      }, ms);
    }

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    wake();
    return () => {
      if (t) clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, [ms, onIdle, onWake]);
}

export function useVimEscape(onTrigger: () => void) {
  const buf = useRef("");
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key.length === 1) {
        buf.current = (buf.current + e.key).slice(-4);
        if (buf.current.endsWith(":wq") || buf.current.endsWith(":q")) {
          buf.current = "";
          onTrigger();
        }
      } else if (e.key === "Escape") {
        buf.current = "";
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTrigger]);
}
