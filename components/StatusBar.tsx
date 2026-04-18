"use client";

import { useEffect, useRef, useState } from "react";
import { useEasterEggs } from "@/components/easter-eggs/context";
import { EGGS } from "@/components/easter-eggs/config";

export default function StatusBar() {
  const { direction, setDirection, discovered, discover } = useEasterEggs();
  const [time, setTime] = useState<string>("");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    }
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  // Publish the bar's real height as a CSS var so .wm can reserve exactly
  // enough padding, even when flex-wrap makes it taller on narrow screens.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const publish = () => {
      document.documentElement.style.setProperty(
        "--status-h",
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

  function cyclePulse() {
    const order: Array<"forward" | "paused" | "reverse"> = ["forward", "paused", "reverse"];
    const i = order.indexOf(direction);
    const next = order[(i + 1) % order.length];
    setDirection(next);
    discover("rain-click");
  }

  return (
    <div className="status" ref={barRef}>
      <span
        className="pulse clickable"
        onClick={cyclePulse}
        role="button"
        aria-label={`warp drive is ${direction}. click to cycle`}
        title="cycle warp drive"
      />
      <span>bruno@milano</span>
      <span className="sep">·</span>
      <span>bridge</span>
      <span className="sep">·</span>
      <span className="ok">online</span>
      <span className="right">
        <span>warp:{direction}</span>
        <span>
          eggs: <strong style={{ color: "var(--accent)" }}>{discovered.size}</strong>/{EGGS.length}
        </span>
        <span>{time}</span>
      </span>
    </div>
  );
}
