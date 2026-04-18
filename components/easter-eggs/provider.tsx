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
import {
  useDevTools,
  useIdle,
  useKonami,
  useTypedWords,
  useVimEscape,
} from "./hooks";
import {
  BRIDGE_SOURCE_URL,
  printBridgeBanner,
  printBrunoHelp,
  type BridgeApi,
} from "./bridge-console";
import { withViewTransition } from "./view-transition";

export default function EasterEggsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [discovered, setDiscovered] = useState<Set<string>>(() => new Set());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const [direction, setDirection] = useState<RainDirection>("forward");
  const [verdant, setVerdant] = useState(false);
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
  // Keep direction in a ref so registerRain can stay identity-stable.
  // Without this, the callback changes whenever `direction` changes, which
  // would tear down and rebuild the entire MatrixRain canvas on every pulse
  // click. See the separate effect below that syncs direction to the rain.
  const directionRef = useRef<RainDirection>(direction);
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // toast helper
  const toast = useCallback((o: { head?: string; msg: string; sub?: string }) => {
    const id = ++toastIdRef.current;
    const item: ToastItem = {
      id,
      head: o.head ?? "bridge",
      msg: o.msg,
      sub: o.sub,
      at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setToasts((prev) => [...prev, item]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  // Use a ref mirror of `discovered` so `discover` can stay identity-stable
  // and also avoid running the toast side-effect inside a setState updater
  // (those are invoked twice in React strict mode, which would double-toast).
  const discoveredRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    discoveredRef.current = discovered;
  }, [discovered]);

  const discover = useCallback(
    (id: string) => {
      if (discoveredRef.current.has(id)) return;
      const next = new Set(discoveredRef.current);
      next.add(id);
      discoveredRef.current = next;
      setDiscovered(next);
      const egg = EGGS.find((e) => e.id === id);
      if (egg) {
        toast({
          head: `+1 egg · ${next.size}/${EGGS.length}`,
          msg: egg.label,
          sub: egg.hint,
        });
      }
    },
    [toast],
  );

  const registerRain = useCallback(
    (api: RainAPI | null) => {
      rainRef.current = api;
      if (api) api.setDirection(directionRef.current);
    },
    [],
  );

  // keep rain in sync with direction state
  useEffect(() => {
    rainRef.current?.setDirection(direction);
  }, [direction]);

  // body class side effects
  useEffect(() => {
    document.body.classList.toggle("verdant", verdant);
  }, [verdant]);
  useEffect(() => {
    document.body.classList.toggle("storm", storm);
  }, [storm]);
  useEffect(() => {
    document.body.classList.toggle("alarming", alarmOpen);
  }, [alarmOpen]);

  const toggleVerdant = useCallback(() => {
    setVerdant((v) => {
      const next = !v;
      toast({
        head: next ? "anomaly engaged" : "anomaly stood down",
        msg: next ? "green bleeds through." : "blue restored.",
      });
      return next;
    });
    discover("verdant-mode");
  }, [discover, toast]);

  const triggerStorm = useCallback(() => {
    setStorm(true);
    rainRef.current?.stormTemp(5000);
    toast({
      head: "storm · weapons hot",
      msg: "Boom. Weapons free.",
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

  // Konami → anomaly mode. Do NOT also discover "konami-glitch" here —
  // that egg is the "click the hero title" one (see Panes.tsx HeroPane).
  useKonami(
    useCallback(() => {
      toggleVerdant();
    }, [toggleVerdant]),
  );

  // Typed words — subtle nods. Storm is loud; the other two are nameless.
  const typedMap = useMemo(
    () => ({
      storm: () => triggerStorm(),
      verdant: () => {
        toggleVerdant();
        discover("verdant-word");
      },
      captain: () => {
        toast({
          head: "signal received",
          msg: "a legendary outlaw left you a nod.",
          sub: "if you know, you know.",
        });
        discover("captain-word");
      },
      // "recon in the source" — only findable by reading the HTML comment
      // in view-source (or the x-bridge-hello meta tag). See app/layout.tsx.
      stowaway: () => {
        toast({
          head: "stowaway logged",
          msg: "you read the source. welcome aboard.",
          sub: "that's how i'd hire you.",
        });
        discover("stowaway");
      },
    }),
    [triggerStorm, toggleVerdant, toast, discover],
  );
  useTypedWords(typedMap);

  // Bridge console handshake. When DevTools is opened we print a cyan
  // ASCII banner, discover the egg, and ensure window.bruno is registered
  // (it's also registered on mount; this is belt-and-braces for the egg).
  useDevTools(
    useCallback(() => {
      printBridgeBanner();
      discover("console");
    }, [discover]),
  );

  // window.bruno — stable identity, methods always dispatch to the current
  // closures via a ref so they never go stale across re-renders.
  const bridgeApiRef = useRef<BridgeApi>({
    storm: () => {},
    alarm: () => {},
    verdant: () => {},
    warp: () => {},
    dock: () => {},
    saver: () => {},
    listEggs: () => [],
  });
  useEffect(() => {
    bridgeApiRef.current = {
      storm: () => triggerStorm(),
      alarm: () => triggerAlarm(),
      verdant: () => toggleVerdant(),
      warp: (d) => setDirection(d),
      dock: () => setRootOn((v) => !v),
      saver: () => setSaverOn(true),
      listEggs: () =>
        EGGS.map((e) => ({
          id: e.id,
          label: e.label,
          found: discoveredRef.current.has(e.id),
        })),
    };
  }, [triggerStorm, triggerAlarm, toggleVerdant]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    type BrunoApi = {
      version: string;
      source: string;
      help: () => string;
      eggs: () => ReturnType<BridgeApi["listEggs"]>;
      storm: () => string;
      alarm: () => string;
      verdant: () => string;
      warp: (d: RainDirection) => string;
      dock: () => string;
      saver: () => string;
    };
    const w = window as Window & { bruno?: BrunoApi };
    w.bruno = {
      version: "bridge-v1",
      source: BRIDGE_SOURCE_URL,
      help() {
        printBrunoHelp();
        return "see you in the palette.";
      },
      eggs() {
        return bridgeApiRef.current.listEggs();
      },
      storm() {
        bridgeApiRef.current.storm();
        return "weapons free";
      },
      alarm() {
        bridgeApiRef.current.alarm();
        return "red alert";
      },
      verdant() {
        bridgeApiRef.current.verdant();
        return "anomaly toggled";
      },
      warp(d) {
        bridgeApiRef.current.warp(d);
        return `warp ${d}`;
      },
      dock() {
        bridgeApiRef.current.dock();
        return "docking at /hollow";
      },
      saver() {
        bridgeApiRef.current.saver();
        return "deep space drift engaged";
      },
    };
    return () => {
      const w2 = window as Window & { bruno?: BrunoApi };
      delete w2.bruno;
    };
  }, []);

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

  // ────────────── BroadcastChannel: cross-tab bridge sync ──────────────
  // When a second tab of the site is open, we sync discovered eggs + warp
  // direction, and fire the "parallel-bridge" egg. Messages are tagged with
  // a per-tab id so we never echo our own broadcasts.
  const bcRef = useRef<BroadcastChannel | null>(null);
  const tabIdRef = useRef<string>("");
  const lastSentDirRef = useRef<RainDirection | null>(null);
  const lastSentEggCountRef = useRef<number>(0);

  type BridgeMsg =
    | { type: "hello"; from: string }
    | { type: "welcome"; from: string; ids: string[]; dir: RainDirection }
    | { type: "eggs"; from: string; ids: string[] }
    | { type: "warp"; from: string; dir: RainDirection }
    | { type: "bye"; from: string };

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return;
    tabIdRef.current = Math.random().toString(36).slice(2, 10);
    const bc = new BroadcastChannel("bruno:bridge");
    bcRef.current = bc;

    let peerSeen = false;
    const notePeer = () => {
      if (peerSeen) return;
      peerSeen = true;
      discover("parallel-bridge");
      toast({
        head: "parallel bridge",
        msg: "another tab is online.",
        sub: "waypoints synced.",
      });
    };

    function onMsg(ev: MessageEvent<BridgeMsg>) {
      const m = ev.data;
      if (!m || m.from === tabIdRef.current) return;
      notePeer();
      if (m.type === "hello") {
        bc.postMessage({
          type: "welcome",
          from: tabIdRef.current,
          ids: Array.from(discoveredRef.current),
          dir: directionRef.current,
        } as BridgeMsg);
      }
      if ((m.type === "eggs" || m.type === "welcome") && Array.isArray(m.ids)) {
        const merged = new Set(discoveredRef.current);
        let grew = false;
        for (const id of m.ids) {
          if (!merged.has(id)) {
            merged.add(id);
            grew = true;
          }
        }
        if (grew) {
          discoveredRef.current = merged;
          lastSentEggCountRef.current = merged.size;
          setDiscovered(merged);
        }
      }
      if ((m.type === "welcome" || m.type === "warp") && "dir" in m && m.dir) {
        lastSentDirRef.current = m.dir;
        setDirection(m.dir);
      }
    }
    bc.addEventListener("message", onMsg);
    bc.postMessage({ type: "hello", from: tabIdRef.current } as BridgeMsg);

    return () => {
      bc.postMessage({ type: "bye", from: tabIdRef.current } as BridgeMsg);
      bc.removeEventListener("message", onMsg);
      bc.close();
      bcRef.current = null;
    };
  }, [discover, toast]);

  // Broadcast egg-set growth (ourselves → peers). We only post when the
  // size grows, which means merging a remote broadcast is a no-op for us.
  useEffect(() => {
    const bc = bcRef.current;
    if (!bc) return;
    if (discovered.size > lastSentEggCountRef.current) {
      lastSentEggCountRef.current = discovered.size;
      bc.postMessage({
        type: "eggs",
        from: tabIdRef.current,
        ids: Array.from(discovered),
      } as BridgeMsg);
    }
  }, [discovered]);

  // Broadcast warp direction changes (ours → peers).
  useEffect(() => {
    const bc = bcRef.current;
    if (!bc) return;
    if (direction !== lastSentDirRef.current) {
      lastSentDirRef.current = direction;
      bc.postMessage({
        type: "warp",
        from: tabIdRef.current,
        dir: direction,
      } as BridgeMsg);
    }
  }, [direction]);

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

      if (e.key === "Escape") {
        if (paletteOpen) { setPaletteOpen(false); return; }
        if (helpOpen) { setHelpOpen(false); return; }
        if (quakeOpen) { setQuakeOpen(false); return; }
        if (saverOn) { setSaverOn(false); return; }
        if (zoomed) { setZoomed(false); return; }
        return;
      }

      if (isTyping) return;

      // NOTE: `discover(...)` is called OUTSIDE the setState updater for
      // every egg below. State updater fns must be pure, and React invokes
      // them twice in strict mode — calling discover inside would toast
      // twice. Current open/zoomed values come from the effect's closure.

      // ⌘/Ctrl + K → ship's controls
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        if (!paletteOpen) discover("palette");
        return;
      }

      // Backtick opens / closes the console (ignored while typing in inputs).
      // Match by physical key (e.code === "Backquote") so we catch dead-key
      // layouts on macOS (US-International, ABC Extended, etc.) where the
      // first press fires e.key === "Dead" and only a second press resolves
      // to a literal backtick. Fall back to e.key for exotic physical maps.
      const isBacktick = e.code === "Backquote" || e.key === "`";
      if (isBacktick && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setQuakeOpen((v) => !v);
        if (!quakeOpen) discover("quake");
        return;
      }

      // ? → bridge manual
      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((v) => !v);
        if (!helpOpen) discover("help");
        return;
      }

      // Enter → bridge-zoom focused pane (View Transitions–smooth)
      if (e.key === "Enter" && focusedPane) {
        e.preventDefault();
        withViewTransition(() => setZoomed((v) => !v));
        if (!zoomed) discover("zoom");
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
        case "toggleVerdant":
          toggleVerdant();
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
            withViewTransition(() => setZoomed((v) => !v));
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
                msg: "welcome to /hollow.",
                sub: "watch your step.",
              });
            }
            return next;
          });
          break;
        case "resetLayout":
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("bruno:reset-layout"));
            toast({
              head: "bulkheads reset",
              msg: "columns back to factory spec.",
            });
          }
          break;
        case "goBlog":
          router.push("/blog");
          break;
      }
    },
    [discover, toggleVerdant, triggerStorm, triggerAlarm, focusedPane, router, toast],
  );

  const value = useMemo<Ctx>(
    () => ({
      discovered,
      discover,
      toast,
      registerRain,
      direction,
      setDirection,
      verdant,
      toggleVerdant,
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
      verdant,
      toggleVerdant,
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
