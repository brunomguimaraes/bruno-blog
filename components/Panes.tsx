"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { useEasterEggs } from "@/components/easter-eggs/context";
import { withViewTransition } from "@/components/easter-eggs/view-transition";
import MatrixRain from "@/components/MatrixRain";
import GlitchText from "@/components/GlitchText";
import type { Post } from "@/lib/posts";
import type { NowEntry } from "@/lib/now";

function PaneShell({
  id,
  title,
  num,
  children,
  className = "",
}: {
  id: string;
  title: string;
  num: string;
  children: ReactNode;
  className?: string;
}) {
  const { focusedPane, setFocusedPane, zoomed, setZoomed } = useEasterEggs();
  const isFocused = focusedPane === id;
  const isZoomTarget = isFocused && zoomed;
  return (
    <section
      className={
        "pane " +
        (isFocused ? "focused " : "") +
        (isZoomTarget ? "zoom-target " : "") +
        className
      }
      style={{ gridArea: id }}
      data-pane-id={id}
      tabIndex={0}
      // When zoomed, the target pane behaves as a modal focus region:
      // siblings are display:none (implicit focus trap), and we flag it
      // as a region/dialog so screen readers announce the state change.
      role={isZoomTarget ? "dialog" : "region"}
      aria-modal={isZoomTarget || undefined}
      aria-label={isZoomTarget ? `${title} — bridge zoom (Esc to exit)` : title}
      onFocus={() => setFocusedPane(id)}
      onClick={() => setFocusedPane(id)}
      onDoubleClick={() => {
        setFocusedPane(id);
        withViewTransition(() => setZoomed((z) => !z));
      }}
    >
      <header>
        <span className="dot" />
        <span>{title}</span>
        <span className="num">{num}</span>
      </header>
      <div className="scan" aria-hidden />
      <div className="body">{children}</div>
    </section>
  );
}

export function HeroPane() {
  const { triggerStorm, discover, focusedPane, zoomed, setFocusedPane } = useEasterEggs();
  const isFocused = focusedPane === "hero";
  const isZoomTarget = isFocused && zoomed;
  return (
    <section
      className={
        "pane hero " +
        (isFocused ? "focused " : "") +
        (isZoomTarget ? "zoom-target " : "")
      }
      style={{ gridArea: "hero" }}
      data-pane-id="hero"
      tabIndex={0}
      role={isZoomTarget ? "dialog" : "region"}
      aria-modal={isZoomTarget || undefined}
      aria-label={isZoomTarget ? "hero — bridge zoom (Esc to exit)" : "hero"}
      onFocus={() => setFocusedPane("hero")}
    >
      <MatrixRain />
      <div className="veil" aria-hidden />
      <div className="scan" aria-hidden />
      <header style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 3, background: "rgba(3,8,20,.65)" }}>
        <span className="dot" />
        <span>hero.tsx</span>
        <span className="num">[0]</span>
      </header>
      <div
        className="body"
        style={{
          position: "absolute",
          inset: 0,
          paddingTop: 56,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 3,
        }}
      >
        <GlitchText
          as="h1"
          onClick={() => {
            triggerStorm();
            discover("konami-glitch");
          }}
        >
          bruno guimaraes
        </GlitchText>
        <div className="lede">
          Fullstack developer. I build web systems that stay calm under load.
          <span className="caret" />
        </div>
        <div className="cmdline">
          <span className="p">$</span> whoami && cat now.txt — <em>20 hidden features baked in</em>
        </div>
        <div className="btns">
          <Link href="/blog" className="btn primary">read the blog</Link>
          <a className="btn" href="mailto:mguimaraesbruno@gmail.com">email me</a>
          <a
            className="btn"
            href="https://www.linkedin.com/in/bruno-guimaraes1"
            target="_blank"
            rel="noreferrer"
          >
            linkedin
          </a>
          <a
            className="btn"
            href="https://github.com/brunomguimaraes"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
        </div>
      </div>
    </section>
  );
}

export function WhoamiPane() {
  return (
    <PaneShell id="whoami" title="whoami" num="[1]">
      <dl className="kv">
        <dt>$ name</dt><dd>Bruno Guimaraes</dd>
        <dt>$ role</dt><dd>Fullstack developer</dd>
        <dt>$ focus</dt><dd>Web systems, DX, on-call sanity</dd>
        <dt>$ stack</dt>
        <dd>
          <span className="chip">TypeScript</span>
          <span className="chip">Next.js</span>
          <span className="chip">Node</span>
          <span className="chip">Postgres</span>
          <span className="chip">Go</span>
        </dd>
      </dl>
    </PaneShell>
  );
}

export function NowPane({ entries }: { entries: NowEntry[] }) {
  return (
    <PaneShell id="now" title="now.log" num="[2]">
      {entries.map((e, i) => {
        const prefix = e.kind === "ok" ? "→" : e.kind === "warn" ? "!" : "×";
        const cls =
          "logline" + (e.kind === "warn" ? " warn" : e.kind === "err" ? " err" : "");
        return (
          <div key={i} className={cls}>
            {prefix} {e.text}
          </div>
        );
      })}
    </PaneShell>
  );
}

export function BlogPane({ posts }: { posts: Post[] }) {
  return (
    <PaneShell id="blog" title="blog/" num="[3]">
      {posts.length === 0 ? (
        <div style={{ opacity: 0.7 }}>no posts yet — check back soon.</div>
      ) : (
        posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="post">
            <div className="meta">
              [{p.date}] {p.tags.map((t) => `#${t}`).join(" ")}
            </div>
            <div className="t">{p.title}</div>
            <div className="d">{p.description}</div>
          </Link>
        ))
      )}
      <div style={{ marginTop: 12 }}>
        <Link href="/blog" className="btn">see all →</Link>
      </div>
    </PaneShell>
  );
}

export function ContactPane() {
  return (
    <PaneShell id="contact" title="contact.sh" num="[4]">
      <div className="logline">
        <span style={{ color: "var(--accent)" }}>$</span> email &nbsp;
        <a className="link" href="mailto:mguimaraesbruno@gmail.com">mguimaraesbruno@gmail.com</a>
      </div>
      <div className="logline">
        <span style={{ color: "var(--accent)" }}>$</span> linkedin &nbsp;
        <a
          className="link"
          href="https://www.linkedin.com/in/bruno-guimaraes1"
          target="_blank"
          rel="noreferrer"
        >
          bruno-guimaraes1
        </a>
      </div>
      <div className="logline">
        <span style={{ color: "var(--accent)" }}>$</span> github &nbsp;
        <a
          className="link"
          href="https://github.com/brunomguimaraes"
          target="_blank"
          rel="noreferrer"
        >
          brunomguimaraes
        </a>
      </div>
      <div style={{ marginTop: 10, opacity: 0.75, fontSize: 12 }}>
        best response time: 24h on weekdays.
      </div>
    </PaneShell>
  );
}

export function RootPane() {
  const { rootOn, triggerAlarm } = useEasterEggs();
  if (!rootOn) return null;
  return (
    <PaneShell id="root" title="/hollow (restricted sector)" num="[#]" className="root-pane">
      <div className="logline err">
        · you&apos;ve docked at /hollow. every click is on the manifest.
      </div>
      <div style={{ marginTop: 10 }}>
        <button
          className="btn"
          style={{ borderColor: "var(--danger)", color: "#ffb3c0" }}
          onClick={triggerAlarm}
        >
          trip the red alert
        </button>
      </div>
    </PaneShell>
  );
}
