"use client";

import { useEffect, useRef } from "react";
import { useEasterEggs } from "./context";

export default function Screensaver() {
  const { saverOn, setSaverOn } = useEasterEggs();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Run a simpler, standalone rain instance while visible.
  useEffect(() => {
    if (!saverOn) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const FONT = 16;
    let columns: number[] = [];

    function resize() {
      if (!cvs) return;
      width = cvs.width = cvs.clientWidth;
      height = cvs.height = cvs.clientHeight;
      const c = Math.floor(width / FONT);
      columns = new Array(c).fill(0).map(() => Math.floor(Math.random() * -40));
    }
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const chars = "アイウエオカキクケコｱｲｳｴｵﾊﾋﾌﾍﾎ0123456789$#@<>/".split("");
    let raf = 0;
    let last = 0;
    const INTERVAL = 1000 / 36;

    function frame(ts: number) {
      raf = requestAnimationFrame(frame);
      if (ts - last < INTERVAL) return;
      last = ts;
      if (!ctx) return;
      ctx.fillStyle = "rgba(0, 5, 16, 0.2)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${FONT}px JetBrains Mono, monospace`;
      for (let i = 0; i < columns.length; i++) {
        const y = columns[i] * FONT;
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const head = y >= 0;
        ctx.fillStyle = head ? "#eaf7ff" : "#1aa3ff";
        if (head) {
          ctx.shadowColor = "#89e6ff";
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillText(ch, i * FONT, y);
        if (y > height && Math.random() > 0.975) columns[i] = 0;
        else columns[i] += 1;
      }
      ctx.shadowBlur = 0;
    }
    raf = requestAnimationFrame(frame);

    function exit() {
      setSaverOn(false);
    }
    window.addEventListener("keydown", exit, { once: true });
    window.addEventListener("mousedown", exit, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", exit);
      window.removeEventListener("mousedown", exit);
    };
  }, [saverOn, setSaverOn]);

  return (
    <div className={"saver" + (saverOn ? " show" : "")} aria-hidden={!saverOn}>
      <canvas ref={canvasRef} />
      <div className="tag">PRESS ANY KEY</div>
    </div>
  );
}
