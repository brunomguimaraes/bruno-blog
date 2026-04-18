"use client";

import { useEffect, useRef } from "react";
import { useEasterEggs } from "@/components/easter-eggs/context";

type Props = {
  className?: string;
};

// NetworkInformation is still experimental and not in lib.dom's stable types.
// We declare what we actually read so we don't leak `any` through the file.
type NetConn = {
  saveData?: boolean;
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g" | string;
};

export default function MatrixRain({ className }: Props) {
  const { registerRain, discover, toast } = useEasterEggs();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvsMaybe = canvasRef.current;
    if (!cvsMaybe) return;
    const ctxMaybe = cvsMaybe.getContext("2d");
    if (!ctxMaybe) return;
    const cvs: HTMLCanvasElement = cvsMaybe;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const FONT = 16;

    // "Adaptive warp" — slow down (or freeze) the rain when the user
    // signals they want less motion or less data. Comes in two flavours:
    //   - navigator.connection says save-data / 2g / 3g → 6fps
    //   - prefers-reduced-motion: reduce → 2fps (a very slow drift)
    // Either case fires the "adaptive-warp" egg once.
    const conn = (navigator as Navigator & { connection?: NetConn }).connection;
    const saveData = !!conn?.saveData;
    const slowNet =
      conn?.effectiveType === "slow-2g" ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "3g";
    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let baseFps = 18;
    let adaptiveReason: string | null = null;
    if (reduceMotion) {
      baseFps = 2;
      adaptiveReason = "reduce-motion";
    } else if (saveData || slowNet) {
      baseFps = 6;
      adaptiveReason = saveData ? "save-data" : `net:${conn?.effectiveType}`;
    }
    if (adaptiveReason) {
      discover("adaptive-warp");
      toast({
        head: "adaptive warp",
        msg: `slow drift engaged · ${adaptiveReason}`,
        sub: "the ship is courteous.",
      });
    }

    // 18fps baseline — a calm, "slow drift" warp rate.
    // Storm mode still kicks it up via `speedMul`/`stormTemp`.
    const BASE_INTERVAL = 1000 / baseFps;
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
    // Visible only when the canvas is intersecting the viewport AND the tab
    // is foregrounded. When false we skip scheduling rAFs entirely — the
    // rain is effectively free. (If we were willing to add a separate file
    // for a worker, the natural next step would be to move the draw loop
    // onto an OffscreenCanvas + Worker. For now, visibility-gated rAF is
    // a bigger win than a worker anyway because a worker would keep going
    // on a hidden tab.)
    let inViewport = true;
    let tabVisible = true;
    const shouldRun = () => inViewport && tabVisible;

    function schedule() {
      if (raf || !shouldRun()) return;
      raf = requestAnimationFrame(frame);
    }
    function unschedule() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function frame(ts: number) {
      raf = 0;
      if (!shouldRun()) return;
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
    schedule();

    // Pause drawing when canvas is scrolled out of view.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inViewport = e.isIntersecting;
          if (inViewport) schedule();
          else unschedule();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(cvs);

    // Pause drawing when the tab is hidden.
    function onVisibility() {
      tabVisible = document.visibilityState === "visible";
      if (tabVisible) schedule();
      else unschedule();
    }
    document.addEventListener("visibilitychange", onVisibility);

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
      unschedule();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      registerRain(null);
    };
  }, [registerRain, discover, toast]);

  return <canvas ref={canvasRef} className={"rain " + (className ?? "")} />;
}
