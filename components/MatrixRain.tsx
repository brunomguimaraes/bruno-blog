"use client";

import { useEffect, useRef } from "react";
import { useEasterEggs } from "@/components/easter-eggs/context";

type Props = {
  className?: string;
};

export default function MatrixRain({ className }: Props) {
  const { registerRain } = useEasterEggs();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvsMaybe = canvasRef.current;
    if (!cvsMaybe) return;
    const ctxMaybe = cvsMaybe.getContext("2d");
    if (!ctxMaybe) return;
    const cvs: HTMLCanvasElement = cvsMaybe;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const FONT = 16;
    // 18fps baseline — a calm, "slow drift" warp rate.
    // Storm mode still kicks it up via `speedMul`/`stormTemp`.
    const BASE_INTERVAL = 1000 / 18;
    let direction: "forward" | "paused" | "reverse" = "forward";
    let speedMul = 1;
    let stormUntil = 0;

    let width = 0;
    let height = 0;
    let columns: number[] = [];
    let trail: number[] = []; // 1 = head, otherwise 0

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲﾝｱｲｳｴｵ0123456789$#@<>/".split(
        "",
      );

    function resize() {
      const rect = cvs.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = Math.floor(rect.width * dpr);
      cvs.height = Math.floor(rect.height * dpr);
      width = rect.width;
      height = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const c = Math.max(1, Math.floor(width / FONT));
      columns = new Array(c).fill(0).map(() => Math.floor(Math.random() * -40));
      trail = new Array(c).fill(0);
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(cvs);

    let raf = 0;
    let last = 0;

    function frame(ts: number) {
      raf = requestAnimationFrame(frame);
      const stormActive = ts < stormUntil;
      const mul = stormActive ? 2 : speedMul;
      const interval = BASE_INTERVAL / Math.max(0.25, mul);
      if (ts - last < interval) return;
      last = ts;
      if (direction === "paused") {
        // still redraw subtle fade so it doesn't freeze visually
        ctx.fillStyle = "rgba(0, 5, 16, 0.05)";
        ctx.fillRect(0, 0, width, height);
        return;
      }

      ctx.fillStyle = "rgba(0, 5, 16, 0.2)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${FONT}px JetBrains Mono, ui-monospace, monospace`;

      const step = direction === "reverse" ? -1 : 1;

      for (let i = 0; i < columns.length; i++) {
        const y = columns[i] * FONT;
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const isHead = trail[i] === 0;
        if (isHead) {
          ctx.fillStyle = "#eaf7ff";
          ctx.shadowColor = "#89e6ff";
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = "#1aa3ff";
          ctx.shadowBlur = 0;
        }
        ctx.fillText(ch, i * FONT, y);

        if (direction === "forward") {
          if (y > height && Math.random() > 0.975) {
            columns[i] = 0;
            trail[i] = 0;
          } else {
            columns[i] += step;
            trail[i] = (trail[i] + 1) % 3;
          }
        } else {
          // reverse
          if (y < 0 && Math.random() > 0.975) {
            columns[i] = Math.floor(height / FONT);
            trail[i] = 0;
          } else {
            columns[i] += step;
            trail[i] = (trail[i] + 1) % 3;
          }
        }
      }
      ctx.shadowBlur = 0;
    }
    raf = requestAnimationFrame(frame);

    const api = {
      setDirection(d: "forward" | "paused" | "reverse") {
        direction = d;
      },
      setSpeed(m: number) {
        speedMul = m;
      },
      stormTemp(ms = 5000) {
        stormUntil = performance.now() + ms;
      },
    };
    registerRain(api);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      registerRain(null);
    };
  }, [registerRain]);

  return <canvas ref={canvasRef} className={"rain " + (className ?? "")} />;
}
