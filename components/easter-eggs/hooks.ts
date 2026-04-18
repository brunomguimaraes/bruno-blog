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

/**
 * Fires `onOpen` the first time we think DevTools is open.
 *
 * Two heuristics, OR'd together:
 *  - window dimension delta (outer vs inner) crosses a threshold
 *  - console.debug(object-with-getter) — DevTools calls the getter when it
 *    tries to render the object in the console panel, which only happens if
 *    the console panel is actually open.
 *
 * Neither is 100% reliable in isolation. Together they catch ~all browsers
 * + docked/undocked configurations. The callback is fired at most once.
 */
export function useDevTools(onOpen: () => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let opened = false;
    const fire = () => {
      if (opened) return;
      opened = true;
      onOpen();
    };

    // Heuristic #1: window deltas
    const THRESHOLD = 160;
    function check() {
      const dh = window.outerHeight - window.innerHeight;
      const dw = window.outerWidth - window.innerWidth;
      if (dh > THRESHOLD || dw > THRESHOLD) fire();
    }

    // Heuristic #2: getter trap via console.debug
    const trap: { id?: string } = {};
    Object.defineProperty(trap, "id", {
      configurable: true,
      get() {
        fire();
        return "bruno@bridge";
      },
    });

    const iv = window.setInterval(() => {
      check();
      // debug is swallowed by the default console filter, so no visible noise
      // when DevTools is closed. When open, the formatter reads `trap.id`
      // to render the object, which fires the getter.
      console.debug(trap);
    }, 1500);
    check();
    window.addEventListener("resize", check);
    return () => {
      window.clearInterval(iv);
      window.removeEventListener("resize", check);
    };
  }, [onOpen]);
}

/**
 * Polls navigator.getGamepads() via rAF once at least one gamepad is
 * connected, and calls the provided callbacks for each logical event:
 * D-pad presses (rising edge), A, B, X, Y.
 *
 * Also fires `onConnect` the first time any pad is detected.
 */
export type GamepadActions = {
  onConnect?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onA?: () => void;
  onB?: () => void;
  onX?: () => void;
  onY?: () => void;
};
export function useGamepad(actions: GamepadActions) {
  const actionsRef = useRef(actions);
  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("getGamepads" in navigator)) return;
    let raf = 0;
    let connected = false;
    // Previous pressed-state per logical button so we only fire on rising edges.
    const prev: Record<string, boolean> = {};

    function edge(name: string, pressed: boolean, handler?: () => void) {
      const was = !!prev[name];
      prev[name] = pressed;
      if (pressed && !was) handler?.();
    }

    function poll() {
      raf = requestAnimationFrame(poll);
      const pads = navigator.getGamepads?.() ?? [];
      const pad = pads.find((p): p is Gamepad => !!p);
      if (!pad) return;
      if (!connected) {
        connected = true;
        actionsRef.current.onConnect?.();
      }
      const a = actionsRef.current;
      // Standard mapping: 12 up, 13 down, 14 left, 15 right, 0 A, 1 B, 2 X, 3 Y.
      edge("up", !!pad.buttons[12]?.pressed || pad.axes[1] < -0.6, a.onUp);
      edge("down", !!pad.buttons[13]?.pressed || pad.axes[1] > 0.6, a.onDown);
      edge("left", !!pad.buttons[14]?.pressed || pad.axes[0] < -0.6, a.onLeft);
      edge("right", !!pad.buttons[15]?.pressed || pad.axes[0] > 0.6, a.onRight);
      edge("a", !!pad.buttons[0]?.pressed, a.onA);
      edge("b", !!pad.buttons[1]?.pressed, a.onB);
      edge("x", !!pad.buttons[2]?.pressed, a.onX);
      edge("y", !!pad.buttons[3]?.pressed, a.onY);
    }

    function onConnect() {
      if (!raf) raf = requestAnimationFrame(poll);
    }
    window.addEventListener("gamepadconnected", onConnect);
    // In case one's already attached
    const already = (navigator.getGamepads?.() ?? []).some((p) => p);
    if (already) onConnect();

    return () => {
      window.removeEventListener("gamepadconnected", onConnect);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
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
