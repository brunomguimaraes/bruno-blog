"use client";

import { useEffect, useRef, useState } from "react";
import { useEasterEggs } from "./context";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const WELCOME: Line[] = [
  { kind: "out", text: "bruno@bridge:~$ — type `help` for commands. Welcome aboard." },
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
        push("out", "bridge commands:");
        push("out", "  help                    this list");
        push("out", "  ls                      list panes");
        push("out", "  cat whoami | now        read a pane");
        push("out", "  warp [forward|paused|reverse]   (alias: rain)");
        push("out", "  storm | boom            5s of chaos");
        push("out", "  verdant                 toggle anomaly mode");
        push("out", "  alarm                   red alert drill");
        push("out", "  saver                   deep space drift");
        push("out", "  touch /hollow           dock at the hollow");
        push("out", "  captain                 listen for an outlaw");
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
      case "warp":
      case "rain": {
        const dir = (arg || "forward") as "forward" | "paused" | "reverse";
        if (!["forward", "paused", "reverse"].includes(dir)) {
          push("err", `warp: unknown direction "${arg}"`);
        } else {
          egg.setDirection(dir);
          egg.discover("rain-click");
          push("ok", `warp drive → ${dir}`);
        }
        break;
      }
      case "storm":
      case "boom":
        egg.triggerStorm();
        push("ok", "storm's loose — 5s. Boom. Weapons free.");
        break;
      case "verdant":
        egg.toggleVerdant();
        egg.discover("verdant-word");
        push("ok", "anomaly engaged.");
        break;
      case "captain":
        egg.toast({
          head: "signal received",
          msg: "a legendary outlaw left you a nod.",
          sub: "if you know, you know.",
        });
        egg.discover("captain-word");
        push("ok", "listening for outlaws…");
        break;
      case "alarm":
        egg.triggerAlarm();
        push("err", "RED ALERT · shields up");
        break;
      case "saver":
        setQuakeOpen(false);
        egg.setSaverOn(true);
        egg.discover("saver");
        push("ok", "drifting into deep space…");
        break;
      case "touch":
        if (arg === "/hollow" || arg === "hollow") {
          egg.setRootOn((v) => !v);
          push("ok", "docking at the hollow. watch your step.");
        } else if (arg === "/root" || arg === "root") {
          egg.triggerAlarm();
          push("err", "permission denied — try /hollow");
        } else {
          push("ok", `touched ${arg || "(nothing)"}`);
        }
        break;
      case "rm":
        if (arg.includes("-rf") && arg.includes("/")) {
          egg.triggerAlarm();
          push("err", "rm: refusing to blow up the bridge");
        } else {
          push("out", `rm: ok`);
        }
        break;
      case "sudo":
        push("err", "bruno is not in the sudoers file. the cat is. this incident will be reported.");
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
      aria-label="Bridge console"
    >
      <header>
        <span>bridge · bruno</span>
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
