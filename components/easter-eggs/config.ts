export type EggDef = {
  id: string;
  label: string;
  key: string; // how to describe the trigger in the help overlay
  hint: string;
};

export const EGGS: EggDef[] = [
  { id: "help", label: "Milano manual", key: "?", hint: "Everything, one screen" },
  { id: "palette", label: "Ship's controls", key: "⌘/Ctrl + K", hint: "Run any feature by name" },
  { id: "quake", label: "Milano console", key: "Ctrl + `", hint: "Drop-down shell, real commands" },
  { id: "rain-click", label: "Warp drive", key: "click the pulse", hint: "forward → paused → reverse" },
  { id: "storm", label: "Rocket: weapons hot", key: 'type "rocket"', hint: "5s of chaos. Blam! Murdered you!" },
  { id: "groot-mode", label: "I AM GROOT", key: "Konami code", hint: "Green bleeds through the blue" },
  { id: "saver", label: "Deep space drift", key: "idle 60s", hint: "Fullscreen rain. Any key wakes the Milano." },
  { id: "alarm", label: "Annihilation wave", key: "touch /knowhere", hint: "Shields up. Brace." },
  { id: "quill-word", label: "Star-Lord checks in", key: 'type "quill"', hint: "Legendary outlaw, etc." },
  { id: "groot-word", label: "I am Groot.", key: 'type "groot"', hint: "Same phrase. Means everything." },
  { id: "zoom", label: "Bridge zoom", key: "Tab then Enter", hint: "Focus one pane, fullscreen it" },
  { id: "vim", label: "Old habits die hard", key: ":wq", hint: "For when you really need out" },
  { id: "konami-glitch", label: "Milano stress test", key: "click the hero title", hint: "Break it a little harder" },
];

export type CommandDef = {
  id: string;
  label: string;
  ico: string;
  sh?: string;
  action: string; // name of provider method
};

export const COMMANDS: CommandDef[] = [
  { id: "help", label: "Show Milano manual", ico: "?", sh: "?", action: "openHelp" },
  { id: "quake", label: "Open Milano console", ico: "⌘", sh: "Ctrl+`", action: "openQuake" },
  { id: "storm", label: "Rocket: weapons hot", ico: "⚡", sh: 'type "rocket"', action: "triggerStorm" },
  { id: "groot-mode", label: "Toggle Groot mode", ico: "◆", sh: "↑↑↓↓←→←→BA", action: "toggleGroot" },
  { id: "rain-pause", label: "Pause warp drive", ico: "⏸", action: "rainPause" },
  { id: "rain-reverse", label: "Reverse warp", ico: "↺", action: "rainReverse" },
  { id: "rain-forward", label: "Resume warp", ico: "▶", action: "rainForward" },
  { id: "saver", label: "Drift in deep space", ico: "✺", action: "startSaver" },
  { id: "alarm", label: "Simulate Annihilation wave", ico: "!", action: "triggerAlarm" },
  { id: "zoom", label: "Bridge-zoom focused pane", ico: "⌗", sh: "Tab, Enter", action: "toggleZoom" },
  { id: "knowhere", label: "Dock at /knowhere", ico: "#", action: "toggleRoot" },
  { id: "go-blog", label: "Go to /blog", ico: "→", action: "goBlog" },
];
