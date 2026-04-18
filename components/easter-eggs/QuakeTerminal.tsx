"use client";

import { useEffect, useRef, useState } from "react";
import { useEasterEggs } from "./context";

type Line = { kind: "in" | "out" | "err" | "ok"; text: string };

const WELCOME: Line[] = [
  { kind: "out", text: "bruno@milano:~$ — type `help` for commands. Welcome aboard." },
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
        push("out", "milano commands:");
        push("out", "  help                    this list");
        push("out", "  ls                      list panes");
        push("out", "  cat whoami | now        read a pane");
        push("out", "  warp [forward|paused|reverse]   (alias: rain)");
        push("out", "  storm | blam            5s of rocket chaos");
        push("out", "  groot                   i am groot.");
        push("out", "  alarm                   annihilation wave drill");
        push("out", "  saver                   deep space drift");
        push("out", "  touch /knowhere         dock at the celestial head");
        push("out", "  quill                   page star-lord");
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
      case "blam":
        egg.triggerStorm();
        push("ok", "rocket is loose — 5s. Blam! Murdered you!");
        break;
      case "groot":
        egg.toggleGroot();
        egg.discover("groot-word");
        push("ok", "i am groot.");
        break;
      case "quill":
        egg.toast({
          head: "star-lord",
          msg: "Peter Quill. Legendary outlaw.",
          sub: "That's a thing now.",
        });
        egg.discover("quill-word");
        push("ok", "paging star-lord…");
        break;
      case "alarm":
        egg.triggerAlarm();
        push("err", "ANNIHILATION WAVE · shields up");
        break;
      case "saver":
        setQuakeOpen(false);
        egg.setSaverOn(true);
        egg.discover("saver");
        push("ok", "drifting into deep space…");
        break;
      case "touch":
        if (arg === "/knowhere" || arg === "knowhere") {
          egg.setRootOn((v) => !v);
          push("ok", "docking at knowhere. watch your step — it's a head.");
        } else if (arg === "/root" || arg === "root") {
          egg.triggerAlarm();
          push("err", "permission denied — try /knowhere");
        } else {
          push("ok", `touched ${arg || "(nothing)"}`);
        }
        break;
      case "rm":
        if (arg.includes("-rf") && arg.includes("/")) {
          egg.triggerAlarm();
          push("err", "rm: refusing to blow up the milano");
        } else {
          push("out", `rm: ok`);
        }
        break;
      case "sudo":
        push("err", "bruno is not in the sudoers file. rocket is. this incident will be reported.");
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
      aria-label="Milano console"
    >
      <header>
        <span>milano · bruno</span>
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
