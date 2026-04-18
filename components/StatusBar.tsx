"use client";

import { useEffect, useState } from "react";
import { useEasterEggs } from "@/components/easter-eggs/context";
import { EGGS } from "@/components/easter-eggs/config";

export default function StatusBar() {
  const { direction, setDirection, discovered, discover } = useEasterEggs();
  const [time, setTime] = useState<string>("");

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

  function cyclePulse() {
    const order: Array<"forward" | "paused" | "reverse"> = ["forward", "paused", "reverse"];
    const i = order.indexOf(direction);
    const next = order[(i + 1) % order.length];
    setDirection(next);
    discover("rain-click");
  }

  return (
    <div className="status">
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
