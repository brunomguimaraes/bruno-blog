export type EggDef = {
  id: string;
  label: string;
  key: string; // how to describe the trigger in the help overlay
  hint: string;
};

export const EGGS: EggDef[] = [
  { id: "help", label: "Bridge manual", key: "?", hint: "Everything, one screen" },
  { id: "palette", label: "Ship's controls", key: "⌘/Ctrl + K", hint: "Run any feature by name" },
  { id: "quake", label: "Bridge console", key: "`", hint: "Drop-down shell, real commands" },
  { id: "rain-click", label: "Warp drive", key: "click the pulse", hint: "forward → paused → reverse" },
  { id: "storm", label: "Storm: weapons hot", key: 'type "storm"', hint: "5 seconds of chaos. buckle up." },
  { id: "verdant-mode", label: "Anomaly mode", key: "Konami code", hint: "Green bleeds through the blue" },
  { id: "saver", label: "Deep space drift", key: "idle 60s", hint: "Fullscreen rain. Any key wakes the ship." },
  { id: "alarm", label: "Red alert drill", key: "touch /hollow", hint: "Shields up. Brace." },
  { id: "captain-word", label: "Captain on deck", key: 'type "captain"', hint: "Legendary outlaw, etc." },
  { id: "verdant-word", label: "The green holds", key: 'type "verdant"', hint: "Same phrase, every time." },
  { id: "zoom", label: "Bridge zoom", key: "Tab then Enter", hint: "Focus one pane, fullscreen it" },
  { id: "vim", label: "Old habits die hard", key: ":wq", hint: "For when you really need out" },
  { id: "konami-glitch", label: "Bridge stress test", key: "click the hero title", hint: "Break it a little harder" },
  // second wave — world-class frontend-dev easter eggs
  { id: "stowaway", label: "Recon in the source", key: 'view-source → type "stowaway"', hint: "A little welcome note in the HTML." },
  { id: "console", label: "Engineer's console", key: "open DevTools", hint: "window.bruno is wired. try .help()" },
  { id: "adaptive-warp", label: "Adaptive warp", key: "save-data or reduce-motion", hint: "The ship respects your bandwidth." },
  { id: "scroll-telemetry", label: "Scroll telemetry", key: "read a post to the end", hint: "Reader knows you finished." },
  { id: "parallel-bridge", label: "Parallel bridge", key: "open a second tab", hint: "Tabs sync eggs + warp direction." },
  { id: "pilot-mode", label: "Pilot mode", key: "plug in a gamepad", hint: "D-pad panes · A palette · Y storm" },
  { id: "reconfigure", label: "Reconfigure bulkheads", key: "drag the column gutter", hint: "Layout saves to the URL hash." },
];

export type CommandDef = {
  id: string;
  label: string;
  ico: string;
  sh?: string;
  action: string; // name of provider method
};

export const COMMANDS: CommandDef[] = [
  { id: "help", label: "Show bridge manual", ico: "?", sh: "?", action: "openHelp" },
  { id: "quake", label: "Open bridge console", ico: "⌘", sh: "`", action: "openQuake" },
  { id: "storm", label: "Storm: weapons hot", ico: "⚡", sh: 'type "storm"', action: "triggerStorm" },
  { id: "verdant-mode", label: "Toggle anomaly mode", ico: "◆", sh: "↑↑↓↓←→←→BA", action: "toggleVerdant" },
  { id: "rain-pause", label: "Pause warp drive", ico: "⏸", action: "rainPause" },
  { id: "rain-reverse", label: "Reverse warp", ico: "↺", action: "rainReverse" },
  { id: "rain-forward", label: "Resume warp", ico: "▶", action: "rainForward" },
  { id: "saver", label: "Drift in deep space", ico: "✺", action: "startSaver" },
  { id: "alarm", label: "Simulate red alert", ico: "!", action: "triggerAlarm" },
  { id: "zoom", label: "Bridge-zoom focused pane", ico: "⌗", sh: "Tab, Enter", action: "toggleZoom" },
  { id: "hollow", label: "Dock at /hollow", ico: "#", action: "toggleRoot" },
  { id: "reset-layout", label: "Reset bulkheads (columns)", ico: "⇔", action: "resetLayout" },
  { id: "go-blog", label: "Go to /blog", ico: "→", action: "goBlog" },
];
