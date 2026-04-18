"use client";

import { useEffect, useRef, useState } from "react";
import { useEasterEggs } from "./context";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const WELCOME: Line[] = [
  { kind: "out", text: "bruno@matrix:~$ — type `help` for commands, `clear` to clear." },
];

export default function QuakeTerminal() {
  const egg = useEasterEggs();
  const { quakeOpen, setQuakeOpen } = egg;
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quakeOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [quakeOpen]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [lines]);

  function run(cmd: string) {
    const trimmed = cmd.trim();
    const next: Line[] = [{ kind: "in", text: trimmed }];
    if (!trimmed) {
      setLines((p) => [...p, ...next]);
      return;
    }
    const [head, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(" ");
    const push = (kind: Line["kind"], text: string) => next.push({ kind, text });

    switch (head.toLowerCase()) {
      case "help":
        push("out", "commands:");
        push("out", "  help                    this list");
        push("out", "  ls                      list panes");
        push("out", "  cat whoami | now        read a pane");
        push("out", "  rain [forward|paused|reverse]");
        push("out", "  storm                   5s matrix storm");
        push("out", "  anomaly                 toggle anomaly mode");
        push("out", "  alarm                   simulate red alert");
        push("out", "  saver                   start screensaver");
        push("out", "  touch /root             …don't.");
        push("out", "  clear                   clear this terminal");
        push("out", "  exit                    close terminal");
        break;
      case "ls":
        push("out", "hero  whoami  now  blog  contact");
        break;
      case "cat": {
        const which = arg.replace(/^\//, "").toLowerCase();
        if (which === "whoami") {
          push("out", "bruno guimaraes — fullstack dev. calm systems, testable code.");
        } else if (which === "now") {
          push("out", "shipping this site. on-call notes. a small weekend hack.");
        } else if (which === "blog") {
          push("out", "see /blog — MDX + next-mdx-remote rsc.");
        } else if (which === "contact") {
          push("out", "mguimaraesbruno@gmail.com  ·  bruno-guimaraes1");
        } else {
          push("err", `cat: ${arg}: no such pane`);
        }
        break;
      }
      case "rain": {
        const dir = (arg || "forward") as "forward" | "paused" | "reverse";
        if (!["forward", "paused", "reverse"].includes(dir)) {
          push("err", `rain: unknown direction "${arg}"`);
        } else {
          egg.setDirection(dir);
          egg.discover("rain-click");
          push("ok", `rain → ${dir}`);
        }
        break;
      }
      case "storm":
        egg.triggerStorm();
        push("ok", "storm incoming — 5s");
        break;
      case "anomaly":
        egg.toggleAnomaly();
        push("ok", "anomaly toggled");
        break;
      case "alarm":
        egg.triggerAlarm();
        push("err", "ALERT: intrusion simulated");
        break;
      case "saver":
        setQuakeOpen(false);
        egg.setSaverOn(true);
        egg.discover("saver");
        push("ok", "entering screensaver…");
        break;
      case "touch":
        if (arg === "/root" || arg === "root") {
          egg.triggerAlarm();
          push("err", "permission denied");
        } else {
          push("ok", `touched ${arg || "(nothing)"}`);
        }
        break;
      case "rm":
        if (arg.includes("-rf") && arg.includes("/")) {
          egg.triggerAlarm();
          push("err", "rm: refusing to destroy everything");
        } else {
          push("out", `rm: ok`);
        }
        break;
      case "sudo":
        push("err", "bruno is not in the sudoers file. this incident will be reported.");
        break;
      case "whoami":
        push("out", "bruno");
        break;
      case "clear":
        setLines([]);
        setValue("");
        return;
      case "exit":
        setQuakeOpen(false);
        setValue("");
        return;
      default:
        push("err", `${head}: command not found`);
    }
    setLines((p) => [...p, ...next]);
  }

  return (
    <div
      className={"quake" + (quakeOpen ? " show" : "")}
      aria-hidden={!quakeOpen}
      role="dialog"
      aria-label="Quake terminal"
    >
      <header>
        <span>quake · bruno@matrix</span>
        <span style={{ marginLeft: "auto", opacity: 0.6 }}>
          Ctrl + ` to close · Esc to dismiss
        </span>
      </header>
      <div className="b" ref={bodyRef}>
        {lines.map((l, i) => (
          <div key={i} className={"ln " + l.kind}>
            {l.kind === "in" ? <span className="p">❯ </span> : null}
            {l.text}
          </div>
        ))}
      </div>
      <div className="prompt">
        <span className="p">❯</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              run(value);
              setValue("");
            }
          }}
          placeholder="type a command…"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
