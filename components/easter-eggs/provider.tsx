"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COMMANDS, EGGS } from "./config";
import {
  EasterEggsContext,
  type Ctx,
  type RainAPI,
  type RainDirection,
} from "./context";
import HelpOverlay from "./HelpOverlay";
import CommandPalette from "./CommandPalette";
import QuakeTerminal from "./QuakeTerminal";
import Screensaver from "./Screensaver";
import CyberterrorAlert from "./CyberterrorAlert";
import ToastHost, { type ToastItem } from "./ToastHost";
import { useIdle, useKonami, useTypedWords, useVimEscape } from "./hooks";

export default function EasterEggsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [discovered, setDiscovered] = useState<Set<string>>(() => new Set());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const [direction, setDirection] = useState<RainDirection>("forward");
  const [groot, setGroot] = useState(false);
  const [storm, setStorm] = useState(false);
  const [alarmOpen, setAlarmOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [quakeOpen, setQuakeOpen] = useState(false);
  const [saverOn, setSaverOn] = useState(false);
  const [focusedPane, setFocusedPane] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [rootOn, setRootOn] = useState(false);

  const rainRef = useRef<RainAPI | null>(null);

  // toast helper
  const toast = useCallback((o: { head?: string; msg: string; sub?: string }) => {
    const id = ++toastIdRef.current;
    const item: ToastItem = {
      id,
      head: o.head ?? "milano",
      msg: o.msg,
      sub: o.sub,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setToasts((prev) => [...prev, item]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const discover = useCallback(
    (id: string) => {
      setDiscovered((prev) => {
        if (prev.has(id)) return prev;
        const next = new Set(prev);
        next.add(id);
        const egg = EGGS.find((e) => e.id === id);
        if (egg) {
          toast({
            head: `+1 egg · ${next.size}/${EGGS.length}`,
            msg: egg.label,
            sub: egg.hint,
          });
        }
        return next;
      });
    },
    [toast],
  );

  const registerRain = useCallback(
    (api: RainAPI | null) => {
      rainRef.current = api;
      if (api) api.setDirection(direction);
    },
    [direction],
  );

  // keep rain in sync with direction state
  useEffect(() => {
    rainRef.current?.setDirection(direction);
  }, [direction]);

  // body class side effects
  useEffect(() => {
    document.body.classList.toggle("groot", groot);
  }, [groot]);
  useEffect(() => {
    document.body.classList.toggle("storm", storm);
  }, [storm]);
  useEffect(() => {
    document.body.classList.toggle("alarming", alarmOpen);
  }, [alarmOpen]);

  const toggleGroot = useCallback(() => {
    setGroot((v) => {
      const next = !v;
      toast({
        head: next ? "i am groot." : "groot stands down",
        msg: next ? "We are Groot." : "Blue restored.",
      });
      return next;
    });
    discover("groot-mode");
  }, [discover, toast]);

  const triggerStorm = useCallback(() => {
    setStorm(true);
    rainRef.current?.stormTemp(5000);
    toast({
      head: "rocket · weapons hot",
      msg: "Blam! Murdered you!",
      sub: "5 seconds of chaos — hold on",
    });
    setTimeout(() => setStorm(false), 5000);
    discover("storm");
  }, [discover, toast]);

  const triggerAlarm = useCallback(() => {
    setAlarmOpen(true);
    discover("alarm");
    setTimeout(() => setAlarmOpen(false), 2400);
  }, [discover]);

  // Konami → groot mode
  useKonami(
    useCallback(() => {
      toggleGroot();
      discover("konami-glitch");
    }, [toggleGroot, discover]),
  );

  // Typed words — all GoG comic flavor
  const typedMap = useMemo(
    () => ({
      rocket: () => triggerStorm(),
      groot: () => {
        toggleGroot();
        discover("groot-word");
      },
      quill: () => {
        toast({
          head: "star-lord",
          msg: "Peter Quill. Legendary outlaw.",
          sub: "That's a thing now.",
        });
        discover("quill-word");
      },
    }),
    [triggerStorm, toggleGroot, toast, discover],
  );
  useTypedWords(typedMap);

  // Vim escape
  useVimEscape(
    useCallback(() => {
      toast({ head: ":wq", msg: "write and quit. nice try." });
      discover("vim");
      setHelpOpen(false);
      setPaletteOpen(false);
      setQuakeOpen(false);
    }, [toast, discover]),
  );

  // Idle → screensaver (home only, flagged via data-home on <html>)
  useIdle(
    60_000,
    useCallback(() => {
      if (
        typeof document !== "undefined" &&
        document.documentElement.dataset.home === "1" &&
        !paletteOpen &&
        !helpOpen &&
        !quakeOpen
      ) {
        setSaverOn(true);
        discover("saver");
      }
    }, [paletteOpen, helpOpen, quakeOpen, discover]),
    useCallback(() => {
      setSaverOn(false);
    }, []),
  );

  // Global keydown dispatcher
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isTyping =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Ctrl + `  — works even in inputs (the Milano console)
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setQuakeOpen((v) => {
          const next = !v;
          if (next) discover("quake");
          return next;
        });
        return;
      }

      if (e.key === "Escape") {
        if (paletteOpen) { setPaletteOpen(false); return; }
        if (helpOpen) { setHelpOpen(false); return; }
        if (quakeOpen) { setQuakeOpen(false); return; }
        if (saverOn) { setSaverOn(false); return; }
        if (zoomed) { setZoomed(false); return; }
        return;
      }

      if (isTyping) return;

      // ⌘/Ctrl + K → ship's controls
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => {
          const next = !v;
          if (next) discover("palette");
          return next;
        });
        return;
      }

      // Bare backtick also opens the console
      if (e.key === "`" && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setQuakeOpen((v) => {
          const next = !v;
          if (next) discover("quake");
          return next;
        });
        return;
      }

      // ? → Milano manual
      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((v) => {
          const next = !v;
          if (next) discover("help");
          return next;
        });
        return;
      }

      // Enter → bridge-zoom focused pane
      if (e.key === "Enter" && focusedPane) {
        e.preventDefault();
        setZoomed((v) => {
          const next = !v;
          if (next) discover("zoom");
          return next;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [helpOpen, paletteOpen, quakeOpen, saverOn, zoomed, focusedPane, discover]);

  const runCommand = useCallback(
    (id: string) => {
      const cmd = COMMANDS.find((c) => c.id === id);
      if (!cmd) return;
      setPaletteOpen(false);
      switch (cmd.action) {
        case "openHelp":
          setHelpOpen(true);
          discover("help");
          break;
        case "openQuake":
          setQuakeOpen(true);
          discover("quake");
          break;
        case "triggerStorm":
          triggerStorm();
          break;
        case "toggleGroot":
          toggleGroot();
          break;
        case "rainPause":
          setDirection("paused");
          discover("rain-click");
          toast({ head: "warp drive", msg: "paused" });
          break;
        case "rainReverse":
          setDirection("reverse");
          discover("rain-click");
          toast({ head: "warp drive", msg: "reversed" });
          break;
        case "rainForward":
          setDirection("forward");
          discover("rain-click");
          toast({ head: "warp drive", msg: "forward" });
          break;
        case "startSaver":
          setSaverOn(true);
          discover("saver");
          break;
        case "triggerAlarm":
          triggerAlarm();
          break;
        case "toggleZoom":
          if (focusedPane) {
            setZoomed((v) => !v);
            discover("zoom");
          } else {
            toast({ head: "bridge zoom", msg: "Tab to focus a pane first." });
          }
          break;
        case "toggleRoot":
          setRootOn((v) => {
            const next = !v;
            if (next) {
              toast({
                head: "docking",
                msg: "Welcome to /knowhere.",
                sub: "Watch your step. It's a head.",
              });
            }
            return next;
          });
          break;
        case "goBlog":
          router.push("/blog");
          break;
      }
    },
    [discover, toggleGroot, triggerStorm, triggerAlarm, focusedPane, router, toast],
  );

  const value = useMemo<Ctx>(
    () => ({
      discovered,
      discover,
      toast,
      registerRain,
      direction,
      setDirection,
      groot,
      toggleGroot,
      storm,
      triggerStorm,
      alarmOpen,
      triggerAlarm,
      helpOpen,
      setHelpOpen,
      paletteOpen,
      setPaletteOpen,
      quakeOpen,
      setQuakeOpen,
      saverOn,
      setSaverOn,
      focusedPane,
      setFocusedPane,
      zoomed,
      setZoomed,
      rootOn,
      setRootOn,
      runCommand,
      commands: COMMANDS,
    }),
    [
      discovered,
      discover,
      toast,
      registerRain,
      direction,
      groot,
      toggleGroot,
      storm,
      triggerStorm,
      alarmOpen,
      triggerAlarm,
      helpOpen,
      paletteOpen,
      quakeOpen,
      saverOn,
      focusedPane,
      zoomed,
      rootOn,
      runCommand,
    ],
  );

  return (
    <EasterEggsContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} />
      <HelpOverlay />
      <CommandPalette />
      <QuakeTerminal />
      <Screensaver />
      <CyberterrorAlert />
    </EasterEggsContext.Provider>
  );
}
