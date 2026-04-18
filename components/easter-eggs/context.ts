"use client";

import { createContext, type Dispatch, type SetStateAction, useContext } from "react";
import type { CommandDef } from "./config";

export type RainDirection = "forward" | "paused" | "reverse";

export type RainAPI = {
  setDirection: (d: RainDirection) => void;
  setSpeed: (multiplier: number) => void;
  stormTemp: (ms?: number) => void;
};

export type ToastOpts = { head?: string; msg: string; sub?: string };

export type Ctx = {
  discovered: Set<string>;
  discover: (id: string) => void;
  toast: (o: ToastOpts) => void;

  registerRain: (api: RainAPI | null) => void;
  direction: RainDirection;
  setDirection: Dispatch<SetStateAction<RainDirection>>;

  groot: boolean;
  toggleGroot: () => void;

  storm: boolean;
  triggerStorm: () => void;

  alarmOpen: boolean;
  triggerAlarm: () => void;

  helpOpen: boolean;
  setHelpOpen: Dispatch<SetStateAction<boolean>>;
  paletteOpen: boolean;
  setPaletteOpen: Dispatch<SetStateAction<boolean>>;
  quakeOpen: boolean;
  setQuakeOpen: Dispatch<SetStateAction<boolean>>;
  saverOn: boolean;
  setSaverOn: Dispatch<SetStateAction<boolean>>;

  focusedPane: string | null;
  setFocusedPane: Dispatch<SetStateAction<string | null>>;
  zoomed: boolean;
  setZoomed: Dispatch<SetStateAction<boolean>>;

  rootOn: boolean;
  setRootOn: Dispatch<SetStateAction<boolean>>;

  runCommand: (id: string) => void;
  commands: CommandDef[];
};

export const EasterEggsContext = createContext<Ctx | null>(null);

export function useEasterEggs(): Ctx {
  const ctx = useContext(EasterEggsContext);
  if (!ctx) throw new Error("useEasterEggs must be used inside EasterEggsProvider");
  return ctx;
}
